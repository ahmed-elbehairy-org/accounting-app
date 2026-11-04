import { ProjectEntity } from '../../entities/project.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'

export interface PartnerShareSummary {
  partnerId: string
  shareCount: number
  investedCapital: number
  investorPoolPercent: number
  effectiveProfitSharePercent: number
}

export function computeProjectStats(
  project: ProjectEntity,
  investments: ShareInvestmentEntity[]
) {
  const activeInvs = investments.filter((i) => !i.deletedAt)
  const totalAllocatedShares = activeInvs.reduce((sum, i) => sum + Number(i.shareCount), 0)
  const totalCapital = activeInvs.reduce((sum, i) => sum + Number(i.totalAmount), 0)
  const targetShares = Math.max(1, project.targetShares)
  const progressPercent = Math.min(100, Math.round((totalAllocatedShares / targetShares) * 100))
  const remainingInvestorsCut = Math.max(0, 100 - Number(project.workerProfitPercentage))

  const partnerMap = new Map<string, { count: number; capital: number }>()
  for (const inv of activeInvs) {
    const cur = partnerMap.get(inv.partnerId) || { count: 0, capital: 0 }
    cur.count += Number(inv.shareCount)
    cur.capital += Number(inv.totalAmount)
    partnerMap.set(inv.partnerId, cur)
  }

  const partnerShares: PartnerShareSummary[] = Array.from(partnerMap.entries()).map(([partnerId, data]) => {
    const investorPoolPercent = totalAllocatedShares > 0 ? (data.count / totalAllocatedShares) * 100 : 0
    const effectiveProfitSharePercent = (remainingInvestorsCut * investorPoolPercent) / 100
    return {
      partnerId,
      shareCount: data.count,
      investedCapital: data.capital,
      investorPoolPercent: Number(investorPoolPercent.toFixed(2)),
      effectiveProfitSharePercent: Number(effectiveProfitSharePercent.toFixed(2))
    }
  })

  return {
    totalAllocatedShares,
    totalCapital,
    progressPercent,
    remainingInvestorsCut,
    partnerShares
  }
}

