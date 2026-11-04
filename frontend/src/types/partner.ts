import type { Partner, AdvanceLoan } from './index'

export interface PartnerStatementData {
  partner: Partner
  investments: Array<{
    id: string
    projectId: string
    projectName?: string
    shareCount: number
    shareUnitPrice: number
    totalAmount: number
    date: string
  }>
  loans: AdvanceLoan[]
  payouts: Array<{
    id: string
    distributionId: string
    grossProfitShare: number
    deductedLoan: number
    reinvestedAmount: number
    netCashPayout: number
    createdAt?: string
  }>
  summary: {
    totalInvestedCapital: number
    activeSharesCount: number
    outstandingLoans: number
    totalLoansIssued: number
    totalPayoutsReceived: number
  }
}

export interface PartnerGlobalStats {
  totalCount: number
  totalInvestedCapital: number
  totalOutstandingLoans: number
  totalActiveShares: number
}

