export interface Partner {
  id: string
  name: string
  phone: string
  notes?: string
  joinedDate: string
  activeSharesCount: number
  totalInvestedCapital: number
  outstandingLoans: number
}

export interface TradingRound {
  id: string
  title: string
  startDate: string
  endDate?: string
  shareUnitPrice: number
  targetShares: number
  totalAllocatedShares: number
  managerProfitCutPercent: number // e.g. 20 means 20% to the manager
  status: 'active' | 'in_liquidation' | 'liquidated'
  description?: string
}

export interface ShareInvestment {
  id: string
  partnerId: string
  roundId: string
  shareCount: number
  shareUnitPrice: number
  totalAmount: number
  date: string
}

export interface AdvanceLoan {
  id: string
  partnerId: string
  amount: number
  deductionType: 'profit_advance' | 'capital_deduction'
  status: 'open' | 'partially_settled' | 'settled'
  date: string
  reason: string
  settledAmount: number
}

export interface Liquidation {
  id: string
  roundId: string
  liquidationDate: string
  initialCapital: number
  finalAssetValue: number // Total cash + unsold goods realized
  grossProfitOrLoss: number
  managerProfit: number
  investorsProfitPool: number
  returnPerShare: number // (initial capital + investor profit pool) / total shares
  notes?: string
}

export interface SettlementPayout {
  id: string
  liquidationId: string
  roundId: string
  partnerId: string
  sharesCount: number
  capitalReturned: number
  profitShare: number
  grossEntitlement: number
  deductedAdvances: number
  netPayable: number
  paid: boolean
}

import type { Project, CashflowItem, Product, ProductCostItem } from './accounting'

export interface AppState {
  partners: Partner[]
  rounds: TradingRound[]
  investments: ShareInvestment[]
  advances: AdvanceLoan[]
  liquidations: Liquidation[]
  settlements: SettlementPayout[]
  projects: Project[]
  cashflows: CashflowItem[]
  products: Product[]
  costItems: ProductCostItem[]
}

