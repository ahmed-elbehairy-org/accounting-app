import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LiquidationEntity } from '../../entities/liquidation.entity'
import { SettlementPayoutEntity } from '../../entities/settlement-payout.entity'
import { ProjectEntity } from '../../entities/project.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { CashflowEntity } from '../../entities/cashflow.entity'
import { BaseService } from '../../common/base.service'
import { computeLiquidation, LiquidationPartnerInput } from './liquidationEngine'

@Injectable()
export class LiquidationsService extends BaseService<LiquidationEntity> {
  constructor(
    @InjectRepository(LiquidationEntity) repo: Repository<LiquidationEntity>,
    @InjectRepository(SettlementPayoutEntity) private readonly payoutRepo: Repository<SettlementPayoutEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(PartnerEntity) private readonly partnerRepo: Repository<PartnerEntity>,
    @InjectRepository(ShareInvestmentEntity) private readonly shareRepo: Repository<ShareInvestmentEntity>,
    @InjectRepository(CashflowEntity) private readonly cashflowRepo: Repository<CashflowEntity>
  ) { super(repo) }

  private async getPartnerInputs(projectId: string, unitPrice: number): Promise<LiquidationPartnerInput[]> {
    const activeInvs = (await this.shareRepo.find({ where: { projectId } })).filter((i) => !i.deletedAt)
    const map = new Map<string, number>()
    activeInvs.forEach((i) => map.set(i.partnerId, (map.get(i.partnerId) || 0) + Number(i.shareCount)))
    const partnerIds = Array.from(map.keys())
    const partners = partnerIds.length ? await this.partnerRepo.findByIds(partnerIds) : []

    return partners.map((p) => ({
      partnerId: p.id, shareCount: map.get(p.id) || 0,
      shareUnitPrice: unitPrice, outstandingLoans: Number(p.outstandingLoans || 0)
    }))
  }

  async preview(projectId: string, finalAssetValue: number) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } })
    if (!project) throw new NotFoundException('المشروع غير موجود')
    const inputs = await this.getPartnerInputs(projectId, Number(project.shareUnitPrice) || 1000)
    return { project, calculation: computeLiquidation(Number(finalAssetValue), Number(project.workerProfitPercentage), inputs) }
  }

  async execute(projectId: string, finalAssetValue: number, notes?: string) {
    const { project, calculation: c } = await this.preview(projectId, finalAssetValue)
    const liq = await this.repository.save(this.repository.create({
      projectId, liquidationDate: new Date().toISOString().split('T')[0],
      initialCapital: c.initialCapital, finalAssetValue: c.finalAssetValue,
      grossProfitOrLoss: c.grossProfitOrLoss, workerProfit: c.workerProfit,
      investorsProfitPool: c.investorsProfitPool, returnPerShare: c.returnPerShare, notes: notes || ''
    }))

    const payouts = await this.payoutRepo.save(c.payouts.map((p) => this.payoutRepo.create({
      ...p, liquidationId: liq.id, projectId, paid: true
    })))

    if (Number(c.workerProfit) > 0) {
      await this.cashflowRepo.save(this.cashflowRepo.create({
        projectId, type: 'outflow', category: 'تصفية - حصة عامل', amount: Number(c.workerProfit),
        entryDate: liq.liquidationDate, description: `صرف حصة العامل عند التصفية (${c.workerProfit} ج)`
      }))
    }

    for (const p of c.payouts) {
      const partner = await this.partnerRepo.findOne({ where: { id: p.partnerId } })
      if (!partner) continue
      if (p.deductedAdvances > 0) partner.outstandingLoans = Math.max(0, Number(partner.outstandingLoans || 0) - p.deductedAdvances)
      partner.activeSharesCount = Math.max(0, Number(partner.activeSharesCount || 0) - p.sharesCount)
      partner.totalInvestedCapital = Math.max(0, Number(partner.totalInvestedCapital || 0) - (p.sharesCount * Number(project.shareUnitPrice)))
      await this.partnerRepo.save(partner)

      if (Number(p.netPayable) > 0) {
        await this.cashflowRepo.save(this.cashflowRepo.create({
          projectId, type: 'outflow', category: 'تصفية - مستحقات شريك', amount: Number(p.netPayable),
          entryDate: liq.liquidationDate, description: `صرف مستحقات تصفية للشريك (${p.netPayable} ج)`
        }))
      }
    }

    project.status = 'liquidated'
    project.endDate = liq.liquidationDate
    await this.projectRepo.save(project)
    return { liquidation: liq, payouts, project }
  }

  getPayouts(liquidationId: string) {
    return this.payoutRepo.find({ where: { liquidationId } })
  }
}
