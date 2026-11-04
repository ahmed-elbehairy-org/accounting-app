import type { Liquidation, SettlementPayout } from './index'

export interface LiquidationCalculation {
  initialCapital: number
  finalAssetValue: number
  grossProfitOrLoss: number
  workerProfit: number
  investorsProfitPool: number
  returnPerShare: number
  payouts: Array<{
    partnerId: string
    sharesCount: number
    capitalReturned: number
    profitShare: number
    grossEntitlement: number
    deductedAdvances: number
    netPayable: number
  }>
}

export interface LiquidationPreviewResponse {
  project: {
    id: string
    name: string
    code: string
    workerProfitPercentage: number
  }
  calculation: LiquidationCalculation
}

export type { Liquidation, SettlementPayout }
