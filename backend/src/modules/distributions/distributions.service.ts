import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProfitDistributionEntity } from '../../entities/profit-distribution.entity'
import { PartnerPayoutEntity } from '../../entities/partner-payout.entity'
import { ProjectEntity } from '../../entities/project.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { CashflowEntity } from '../../entities/cashflow.entity'
import { BaseService } from '../../common/base.service'
import { computeDistribution, PartnerDistInput } from './distribution.calculator'
import { approveDistributionWorkflow } from './distributions.approver'

@Injectable()
export class DistributionsService extends BaseService<ProfitDistributionEntity> {
  constructor(
    @InjectRepository(ProfitDistributionEntity) repo: Repository<ProfitDistributionEntity>,
    @InjectRepository(PartnerPayoutEntity) private readonly payoutRepo: Repository<PartnerPayoutEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(PartnerEntity) private readonly partnerRepo: Repository<PartnerEntity>,
    @InjectRepository(ShareInvestmentEntity) private readonly shareRepo: Repository<ShareInvestmentEntity>,
    @InjectRepository(CashflowEntity) private readonly cashflowRepo: Repository<CashflowEntity>
  ) { super(repo) }

  async buildPartnerInputs(projectId: string, options: Record<string, { settleLoan?: boolean; reinvestAmount?: number }> = {}) {
    const activeInvs = (await this.shareRepo.find({ where: { projectId } })).filter((i) => !i.deletedAt)
    const map = new Map<string, number>()
    activeInvs.forEach((i) => map.set(i.partnerId, (map.get(i.partnerId) || 0) + Number(i.shareCount)))
    const partnerIds = Array.from(map.keys())
    const partners = partnerIds.length ? await this.partnerRepo.findByIds(partnerIds) : []

    return partners.map((p): PartnerDistInput => ({
      partnerId: p.id,
      shareCount: map.get(p.id) || 0,
      outstandingLoans: Number(p.outstandingLoans || 0),
      settleLoan: options[p.id]?.settleLoan ?? true,
      reinvestAmount: options[p.id]?.reinvestAmount || 0
    }))
  }

  async preview(dto: { projectId: string; totalProfit: number; distributedAmount: number; partnerOptions?: any }) {
    const project = await this.projectRepo.findOne({ where: { id: dto.projectId } })
    if (!project) throw new NotFoundException('المشروع غير موجود')
    const inputs = await this.buildPartnerInputs(dto.projectId, dto.partnerOptions)
    return computeDistribution(Number(dto.totalProfit), Number(dto.distributedAmount), Number(project.workerProfitPercentage), inputs)
  }

  async create(dto: { projectId: string; totalProfit: number; distributedAmount: number; partnerOptions?: any; notes?: string }) {
    const calc = await this.preview(dto)
    const dist = await this.repository.save(this.repository.create({
      projectId: dto.projectId, totalProfit: calc.totalProfit, distributedAmount: calc.distributedAmount,
      retainedAmount: calc.retainedAmount, workerCut: calc.workerCut, investorPool: calc.investorPool,
      distributionDate: new Date().toISOString().split('T')[0], status: 'draft', notes: dto.notes || ''
    }))
    const payouts = await this.payoutRepo.save(calc.payouts.map((p) => this.payoutRepo.create({
      ...p, distributionId: dist.id, projectId: dto.projectId, status: 'pending'
    })))
    return { distribution: dist, payouts }
  }

  async approve(id: string) {
    const dist = await this.repository.findOne({ where: { id } })
    if (!dist) throw new NotFoundException('التوزيع غير موجود')
    const payouts = await this.payoutRepo.find({ where: { distributionId: id } })
    return approveDistributionWorkflow(dist, payouts, this.repository, this.payoutRepo, this.partnerRepo, this.projectRepo, this.shareRepo, this.cashflowRepo)
  }

  getPayouts(distributionId: string) {
    return this.payoutRepo.find({ where: { distributionId } })
  }
}
