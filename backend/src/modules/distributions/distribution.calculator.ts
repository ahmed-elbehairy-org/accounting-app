export interface PartnerDistInput {
  partnerId: string
  shareCount: number
  outstandingLoans?: number
  reinvestAmount?: number
  settleLoan?: boolean
}

export interface CalculatedPayout {
  partnerId: string
  shareCount: number
  investorPoolPercent: number
  grossProfitShare: number
  deductedLoan: number
  reinvestedAmount: number
  netCashPayout: number
  payoutMethod: 'cash' | 'reinvest' | 'mixed'
}

export function computeDistribution(
  totalProfit: number,
  distributedAmount: number,
  workerProfitPercentage: number,
  partners: PartnerDistInput[]
) {
  const dist = Math.min(totalProfit, Math.max(0, distributedAmount))
  const retained = Number((totalProfit - dist).toFixed(2))
  const workerCut = Number(((dist * workerProfitPercentage) / 100).toFixed(2))
  const investorPool = Number((dist - workerCut).toFixed(2))

  const totalShares = partners.reduce((s, p) => s + (p.shareCount || 0), 0)

  const payouts: CalculatedPayout[] = partners.map((p) => {
    const poolPercent = totalShares > 0 ? (p.shareCount / totalShares) * 100 : 0
    const gross = Number(((investorPool * poolPercent) / 100).toFixed(2))

    const loan = Number(p.outstandingLoans || 0)
    const deductedLoan = p.settleLoan ? Number(Math.min(loan, gross).toFixed(2)) : 0
    const availableAfterLoan = gross - deductedLoan

    const requestedReinvest = Number(p.reinvestAmount || 0)
    const reinvested = Number(Math.min(requestedReinvest, availableAfterLoan).toFixed(2))
    const netCash = Number((availableAfterLoan - reinvested).toFixed(2))

    let method: 'cash' | 'reinvest' | 'mixed' = 'cash'
    if (reinvested > 0 && netCash === 0) method = 'reinvest'
    else if (reinvested > 0 && netCash > 0) method = 'mixed'

    return {
      partnerId: p.partnerId,
      shareCount: p.shareCount,
      investorPoolPercent: Number(poolPercent.toFixed(2)),
      grossProfitShare: gross,
      deductedLoan,
      reinvestedAmount: reinvested,
      netCashPayout: netCash,
      payoutMethod: method
    }
  })

  return {
    totalProfit: Number(totalProfit.toFixed(2)),
    distributedAmount: dist,
    retainedAmount: retained,
    workerCut,
    investorPool,
    payouts
  }
}

