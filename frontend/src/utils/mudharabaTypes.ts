import type { Partner } from '../types/mudharaba'

export interface PartnerPayoutSimulation {
  partner: Partner
  sharesCount: number
  sharePercentage: number
  capitalReturned: number
  profitEarned: number
  grossEntitlement: number
  totalAdvances: number
  netPayable: number
}

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
  partnerPayouts: PartnerPayoutSimulation[]
}
