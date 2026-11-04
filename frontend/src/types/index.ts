export interface BaseItem {
  id: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export interface Partner extends BaseItem {
  name: string
  phone: string
  notes?: string
  joinedDate: string
  activeSharesCount: number
  totalInvestedCapital: number
  outstandingLoans: number
}

export interface Project extends BaseItem {
  name: string
  code: string
  description?: string
  status: 'active' | 'liquidated'
  shareUnitPrice: number
  targetShares: number
  totalAllocatedShares: number
  workerProfitPercentage: number
  workerName: string
  startDate: string
  endDate?: string
}

export interface ShareInvestment extends BaseItem {
  partnerId: string
  projectId: string
  shareCount: number
  shareUnitPrice: number
  totalAmount: number
  date: string
}

export interface CashflowItem extends BaseItem {
  projectId: string
  type: 'inflow' | 'outflow'
  category: string
  amount: number
  entryDate: string
  description?: string
}

export interface CashflowSummary {
  totalInflow: number
  totalOutflow: number
  netCashflow: number
  inflowCount: number
  outflowCount: number
}

export interface Liquidation extends BaseItem {
  projectId: string
  liquidationDate: string
  initialCapital: number
  finalAssetValue: number
  grossProfitOrLoss: number
  workerProfit: number
  investorsProfitPool: number
  returnPerShare: number
  notes?: string
}

export interface SettlementPayout extends BaseItem {
  liquidationId: string
  projectId: string
  partnerId: string
  sharesCount: number
  capitalReturned: number
  profitShare: number
  grossEntitlement: number
  deductedAdvances: number
  netPayable: number
  paid: boolean
}

export interface AdvanceLoan extends BaseItem {
  partnerId: string
  amount: number
  deductionType: 'profit_advance' | 'capital_deduction'
  status: 'open' | 'partially_settled' | 'settled'
  date: string
  reason: string
  settledAmount: number
}

