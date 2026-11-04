export interface LiquidationPartnerInput {
  partnerId: string
  shareCount: number
  shareUnitPrice: number
  outstandingLoans?: number
}

export interface SettlementPayoutResult {
  partnerId: string
  sharesCount: number
  capitalReturned: number
  profitShare: number
  grossEntitlement: number
  deductedAdvances: number
  netPayable: number
}

export function computeLiquidation(
  finalAssetValue: number,
  workerProfitPercentage: number,
  partners: LiquidationPartnerInput[]
) {
  const totalShares = partners.reduce((s, p) => s + (p.shareCount || 0), 0)
  const initialCapital = partners.reduce((s, p) => s + (p.shareCount * p.shareUnitPrice), 0)
  const grossDiff = Number((finalAssetValue - initialCapital).toFixed(2))

  const isProfit = grossDiff > 0
  const workerProfit = isProfit ? Number(((grossDiff * workerProfitPercentage) / 100).toFixed(2)) : 0
  const investorsProfitPool = isProfit ? Number((grossDiff - workerProfit).toFixed(2)) : 0
  const returnPerShare = totalShares > 0 ? Number((finalAssetValue / totalShares).toFixed(2)) : 0

  const payouts: SettlementPayoutResult[] = partners.map((p) => {
    const poolPercent = totalShares > 0 ? (p.shareCount / totalShares) : 0
    let capReturned: number
    let profShare: number

    if (isProfit) {
      capReturned = Number((p.shareCount * p.shareUnitPrice).toFixed(2))
      profShare = Number((investorsProfitPool * poolPercent).toFixed(2))
    } else {
      capReturned = Number((finalAssetValue * poolPercent).toFixed(2))
      profShare = 0
    }

    const grossEntitlement = Number((capReturned + profShare).toFixed(2))
    const loan = Number(p.outstandingLoans || 0)
    const deductedAdvances = Number(Math.min(loan, grossEntitlement).toFixed(2))
    const netPayable = Number((grossEntitlement - deductedAdvances).toFixed(2))

    return {
      partnerId: p.partnerId,
      sharesCount: p.shareCount,
      capitalReturned: capReturned,
      profitShare: profShare,
      grossEntitlement,
      deductedAdvances,
      netPayable
    }
  })

  return {
    initialCapital: Number(initialCapital.toFixed(2)),
    finalAssetValue: Number(finalAssetValue.toFixed(2)),
    grossProfitOrLoss: grossDiff,
    workerProfit,
    investorsProfitPool,
    returnPerShare,
    payouts
  }
}

