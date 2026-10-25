import type { AppState, Partner, SettlementPayout, Liquidation } from '../types/mudharaba'


export interface RoundLiquidationSimulation {
  roundId: string
  initialCapital: number
  finalAssetValue: number
  grossProfit: number
  isProfit: boolean
  managerCutPercent: number
  managerProfit: number
  investorsProfitPool: number
  returnPerShare: number
  partnerPayouts: {
    partner: Partner
    sharesCount: number
    sharePercentage: number
    capitalReturned: number
    profitEarned: number
    grossEntitlement: number
    totalAdvances: number
    netPayable: number
  }[]
}

/**
 * Calculates simulated or final liquidation for a trading round
 */
export function calculateRoundLiquidation(
  state: AppState,
  roundId: string,
  finalAssetValue: number
): RoundLiquidationSimulation | null {
  const round = state.rounds.find((r) => r.id === roundId)
  if (!round) return null

  const roundInvestments = state.investments.filter((inv) => inv.roundId === roundId)
  const totalShares = roundInvestments.reduce((sum, inv) => sum + inv.shareCount, 0)
  const initialCapital = roundInvestments.reduce((sum, inv) => sum + inv.totalAmount, 0)

  const grossProfit = finalAssetValue - initialCapital
  const isProfit = grossProfit > 0

  let managerProfit = 0
  let investorsProfitPool = 0

  if (isProfit) {
    managerProfit = grossProfit * (round.managerProfitCutPercent / 100)
    investorsProfitPool = grossProfit - managerProfit
  } else {
    // In Islamic Mudharaba, capital loss is borne by capital owners proportionally, manager loses labor/effort unless negligence
    investorsProfitPool = grossProfit // negative
    managerProfit = 0
  }

  const profitPerShare = totalShares > 0 ? investorsProfitPool / totalShares : 0
  const returnPerShare = totalShares > 0 ? finalAssetValue / totalShares : 0

  // Partner breakdowns
  const partnerPayouts = state.partners.map((partner) => {
    const partnerInvestments = roundInvestments.filter((inv) => inv.partnerId === partner.id)
    const sharesCount = partnerInvestments.reduce((sum, inv) => sum + inv.shareCount, 0)
    const sharePercentage = totalShares > 0 ? (sharesCount / totalShares) * 100 : 0
    const capitalInvested = partnerInvestments.reduce((sum, inv) => sum + inv.totalAmount, 0)

    let profitEarned = 0
    let capitalReturned = capitalInvested

    if (isProfit) {
      profitEarned = sharesCount * profitPerShare
    } else {
      // In case of loss, capital returned is diminished proportionally
      capitalReturned = Math.max(0, capitalInvested + (sharesCount * profitPerShare))
    }

    const grossEntitlement = capitalReturned + profitEarned

    // Get open advances for this partner
    const openAdvances = state.advances.filter(
      (adv) => adv.partnerId === partner.id && adv.status === 'open'
    )
    const totalAdvances = openAdvances.reduce((sum, adv) => sum + (adv.amount - adv.settledAmount), 0)

    const netPayable = grossEntitlement - totalAdvances

    return {
      partner,
      sharesCount,
      sharePercentage,
      capitalReturned,
      profitEarned,
      grossEntitlement,
      totalAdvances,
      netPayable
    }
  }).filter((p) => p.sharesCount > 0)

  return {
    roundId,
    initialCapital,
    finalAssetValue,
    grossProfit,
    isProfit,
    managerCutPercent: round.managerProfitCutPercent,
    managerProfit,
    investorsProfitPool,
    returnPerShare,
    partnerPayouts
  }
}

/**
 * Executes and commits a final liquidation to app state
 */
export function executeLiquidation(
  state: AppState,
  simulation: RoundLiquidationSimulation,
  notes?: string
): AppState {
  const liquidationId = `liq-${Date.now()}`

  const newLiquidation: Liquidation = {
    id: liquidationId,
    roundId: simulation.roundId,
    liquidationDate: new Date().toISOString().split('T')[0],
    initialCapital: simulation.initialCapital,
    finalAssetValue: simulation.finalAssetValue,
    grossProfitOrLoss: simulation.grossProfit,
    managerProfit: simulation.managerProfit,
    investorsProfitPool: simulation.investorsProfitPool,
    returnPerShare: simulation.returnPerShare,
    notes: notes || 'تمت التصفية والمقاصة'
  }

  const newSettlements: SettlementPayout[] = simulation.partnerPayouts.map((p) => ({
    id: `settle-${Date.now()}-${p.partner.id}`,
    liquidationId,
    roundId: simulation.roundId,
    partnerId: p.partner.id,
    sharesCount: p.sharesCount,
    capitalReturned: p.capitalReturned,
    profitShare: p.profitEarned,
    grossEntitlement: p.grossEntitlement,
    deductedAdvances: p.totalAdvances,
    netPayable: p.netPayable,
    paid: false
  }))

  // Update round status to liquidated
  const updatedRounds = state.rounds.map((r) =>
    r.id === simulation.roundId
      ? { ...r, status: 'liquidated' as const, endDate: newLiquidation.liquidationDate }
      : r
  )

  // Mark deducted advances as settled
  const settledPartnerIds = new Set(simulation.partnerPayouts.map((p) => p.partner.id))
  const updatedAdvances = state.advances.map((adv) => {
    if (settledPartnerIds.has(adv.partnerId) && adv.status === 'open') {
      return {
        ...adv,
        status: 'settled' as const,
        settledAmount: adv.amount
      }
    }
    return adv
  })

  // Update partner stats (outstanding loans & active shares)
  const updatedPartners = state.partners.map((partner) => {
    const payout = simulation.partnerPayouts.find((p) => p.partner.id === partner.id)
    if (!payout) return partner

    const newActiveShares = Math.max(0, partner.activeSharesCount - payout.sharesCount)
    const newLoans = Math.max(0, partner.outstandingLoans - payout.totalAdvances)

    return {
      ...partner,
      activeSharesCount: newActiveShares,
      outstandingLoans: newLoans
    }
  })

  return {
    ...state,
    rounds: updatedRounds,
    liquidations: [newLiquidation, ...state.liquidations],
    settlements: [...newSettlements, ...state.settlements],
    advances: updatedAdvances,
    partners: updatedPartners
  }
}
