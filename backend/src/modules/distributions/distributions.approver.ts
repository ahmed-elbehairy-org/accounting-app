import { Repository } from 'typeorm'
import { ProfitDistributionEntity } from '../../entities/profit-distribution.entity'
import { PartnerPayoutEntity } from '../../entities/partner-payout.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { ProjectEntity } from '../../entities/project.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { CashflowEntity } from '../../entities/cashflow.entity'

export async function approveDistributionWorkflow(
  dist: ProfitDistributionEntity,
  payouts: PartnerPayoutEntity[],
  distRepo: Repository<ProfitDistributionEntity>,
  payoutRepo: Repository<PartnerPayoutEntity>,
  partnerRepo: Repository<PartnerEntity>,
  projectRepo: Repository<ProjectEntity>,
  shareRepo: Repository<ShareInvestmentEntity>,
  cashflowRepo?: Repository<CashflowEntity>
) {
  const project = await projectRepo.findOne({ where: { id: dist.projectId } })

  if (cashflowRepo && Number(dist.workerCut) > 0) {
    await cashflowRepo.save(cashflowRepo.create({
      projectId: dist.projectId, type: 'outflow', category: 'توزيع أرباح - عامل',
      amount: Number(dist.workerCut), entryDate: dist.distributionDate,
      description: `صرف حصة العامل (${dist.workerCut} ج)`
    }))
  }

  for (const payout of payouts) {
    const partner = await partnerRepo.findOne({ where: { id: payout.partnerId } })
    if (!partner) continue

    if (Number(payout.deductedLoan) > 0) {
      partner.outstandingLoans = Math.max(0, Number(partner.outstandingLoans || 0) - Number(payout.deductedLoan))
    }

    if (Number(payout.reinvestedAmount) > 0 && project) {
      const unitPrice = Number(project.shareUnitPrice) || 1000
      const newShares = Math.floor(Number(payout.reinvestedAmount) / unitPrice)
      if (newShares > 0) {
        partner.activeSharesCount = Number(partner.activeSharesCount || 0) + newShares
        partner.totalInvestedCapital = Number(partner.totalInvestedCapital || 0) + Number(payout.reinvestedAmount)
        project.totalAllocatedShares = Number(project.totalAllocatedShares || 0) + newShares
        await shareRepo.save(shareRepo.create({
          partnerId: partner.id, projectId: project.id, shareCount: newShares,
          shareUnitPrice: unitPrice, totalAmount: Number(payout.reinvestedAmount), date: dist.distributionDate
        }))
      }
    }

    if (cashflowRepo && Number(payout.netCashPayout) > 0) {
      await cashflowRepo.save(cashflowRepo.create({
        projectId: dist.projectId, type: 'outflow', category: 'توزيع أرباح - شريك',
        amount: Number(payout.netCashPayout), entryDate: dist.distributionDate,
        description: `صرف أرباح نقدية للشريك ${partner.name || partner.id}`
      }))
    }

    await partnerRepo.save(partner)
    payout.status = 'paid'
  }

  if (project) await projectRepo.save(project)
  dist.status = 'approved'
  await payoutRepo.save(payouts)
  return distRepo.save(dist)
}
