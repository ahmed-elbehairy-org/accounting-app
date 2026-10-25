import type { AppState, Liquidation, SettlementPayout } from '../types/mudharaba'
import type { RoundLiquidationSimulation } from './mudharabaTypes'

export function executeLiquidation(
  state: AppState,
  sim: RoundLiquidationSimulation,
  notes?: string
): AppState {
  const liquidationId = `liq-${Date.now()}`
  const date = new Date().toISOString().split('T')[0]

  const newLiq: Liquidation = {
    id: liquidationId,
    roundId: sim.roundId,
    liquidationDate: date,
    initialCapital: sim.initialCapital,
    finalAssetValue: sim.finalAssetValue,
    grossProfitOrLoss: sim.grossProfit,
    managerProfit: sim.managerProfit,
    investorsProfitPool: sim.investorsProfitPool,
    returnPerShare: sim.returnPerShare,
    notes: notes || 'تمت التصفية والمقاصة'
  }

  const newSettlements: SettlementPayout[] = sim.partnerPayouts.map((p) => ({
    id: `settle-${Date.now()}-${p.partner.id}`,
    liquidationId,
    roundId: sim.roundId,
    partnerId: p.partner.id,
    sharesCount: p.sharesCount,
    capitalReturned: p.capitalReturned,
    profitShare: p.profitEarned,
    grossEntitlement: p.grossEntitlement,
    deductedAdvances: p.totalAdvances,
    netPayable: p.netPayable,
    paid: false
  }))

  const updatedRounds = state.rounds.map((r) =>
    r.id === sim.roundId ? { ...r, status: 'liquidated' as const, endDate: date } : r
  )

  const settledPartnerIds = new Set(sim.partnerPayouts.map((p) => p.partner.id))
  const updatedAdvances = state.advances.map((adv) =>
    settledPartnerIds.has(adv.partnerId) && adv.status === 'open'
      ? { ...adv, status: 'settled' as const, settledAmount: adv.amount }
      : adv
  )

  const updatedPartners = state.partners.map((partner) => {
    const payout = sim.partnerPayouts.find((p) => p.partner.id === partner.id)
    if (!payout) return partner
    return {
      ...partner,
      activeSharesCount: Math.max(0, partner.activeSharesCount - payout.sharesCount),
      outstandingLoans: Math.max(0, partner.outstandingLoans - payout.totalAdvances)
    }
  })

  return {
    ...state,
    rounds: updatedRounds,
    liquidations: [newLiq, ...state.liquidations],
    settlements: [...newSettlements, ...state.settlements],
    advances: updatedAdvances,
    partners: updatedPartners
  }
}
