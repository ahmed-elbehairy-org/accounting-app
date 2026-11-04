import { Repository } from 'typeorm'
import { PartnerEntity } from '../../entities/partner.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { PartnerPayoutEntity } from '../../entities/partner-payout.entity'
import { ProjectEntity } from '../../entities/project.entity'

export async function buildPartnerStatement(
  partner: PartnerEntity,
  shareRepo: Repository<ShareInvestmentEntity>,
  advRepo: Repository<AdvanceLoanEntity>,
  payoutRepo: Repository<PartnerPayoutEntity>,
  projectRepo: Repository<ProjectEntity>
) {
  const [investments, loans, payouts, projects] = await Promise.all([
    shareRepo.find({ where: { partnerId: partner.id }, order: { createdAt: 'DESC' } }),
    advRepo.find({ where: { partnerId: partner.id }, order: { createdAt: 'DESC' } }),
    payoutRepo.find({ where: { partnerId: partner.id }, order: { createdAt: 'DESC' } }),
    projectRepo.find()
  ])

  const projectMap = new Map<string, string>()
  projects.forEach((p) => projectMap.set(p.id, p.name))

  const formattedInvestments = investments.map((i) => ({
    ...i,
    projectName: projectMap.get(i.projectId) || i.projectId
  }))

  const totalLoansIssued = loans.reduce((s, l) => s + (Number(l.amount) || 0), 0)
  const totalPayoutsReceived = payouts.reduce((s, p) => s + (Number(p.netCashPayout) || 0), 0)

  return {
    partner,
    investments: formattedInvestments,
    loans,
    payouts,
    summary: {
      totalInvestedCapital: Number(partner.totalInvestedCapital) || 0,
      activeSharesCount: Number(partner.activeSharesCount) || 0,
      outstandingLoans: Number(partner.outstandingLoans) || 0,
      totalLoansIssued,
      totalPayoutsReceived
    }
  }
}

