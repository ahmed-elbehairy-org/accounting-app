import type { AppState } from '../types/mudharaba'
import type { RoundLiquidationSimulation, PartnerPayoutSimulation } from './mudharabaTypes'
export type { RoundLiquidationSimulation, PartnerPayoutSimulation } from './mudharabaTypes'
export { executeLiquidation } from './mudharabaExecution'

export function calculateRoundLiquidation(
  state: AppState,
  roundId: string,
  finalAssetValue: number
): RoundLiquidationSimulation | null {
  const round = state.rounds.find((r) => r.id === roundId)
  if (!round) return null

  const roundInvs = state.investments.filter((inv) => inv.roundId === roundId)
  const totalShares = roundInvs.reduce((sum, inv) => sum + inv.shareCount, 0)
  const initialCapital = roundInvs.reduce((sum, inv) => sum + inv.totalAmount, 0)

  const grossProfit = finalAssetValue - initialCapital
  const isProfit = grossProfit > 0
  const managerProfit = isProfit ? grossProfit * (round.managerProfitCutPercent / 100) : 0
  const investorsProfitPool = isProfit ? grossProfit - managerProfit : grossProfit

  const profitPerShare = totalShares > 0 ? investorsProfitPool / totalShares : 0
  const returnPerShare = totalShares > 0 ? finalAssetValue / totalShares : 0

  const partnerPayouts: PartnerPayoutSimulation[] = state.partners
    .map((partner) => {
      const pInvs = roundInvs.filter((inv) => inv.partnerId === partner.id)
      const sharesCount = pInvs.reduce((sum, inv) => sum + inv.shareCount, 0)
      if (sharesCount === 0) return null

      const sharePercentage = totalShares > 0 ? (sharesCount / totalShares) * 100 : 0
      const capitalInvested = pInvs.reduce((sum, inv) => sum + inv.totalAmount, 0)
      const profitEarned = isProfit ? sharesCount * profitPerShare : 0
      const capitalReturned = isProfit ? capitalInvested : Math.max(0, capitalInvested + sharesCount * profitPerShare)
      const grossEntitlement = capitalReturned + profitEarned

      const openAdvances = state.advances.filter((a) => a.partnerId === partner.id && a.status === 'open')
      const totalAdvances = openAdvances.reduce((sum, a) => sum + (a.amount - a.settledAmount), 0)
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
    })
    .filter((p): p is PartnerPayoutSimulation => p !== null)

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
