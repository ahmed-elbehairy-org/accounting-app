import type { BaseItem } from './index'

export interface ProfitDistribution extends BaseItem {
  projectId: string
  totalProfit: number
  distributedAmount: number
  retainedAmount: number
  workerCut: number
  investorPool: number
  distributionDate: string
  status: 'draft' | 'approved'
  notes?: string
}

export interface PartnerPayout extends BaseItem {
  distributionId: string
  projectId: string
  partnerId: string
  shareCount: number
  investorPoolPercent: number
  grossProfitShare: number
  deductedLoan: number
  reinvestedAmount: number
  netCashPayout: number
  payoutMethod: 'cash' | 'reinvest' | 'mixed'
  status: 'pending' | 'paid'
}

export interface DistributionPreview {
  totalProfit: number
  distributedAmount: number
  retainedAmount: number
  workerCut: number
  investorPool: number
  payouts: Array<{
    partnerId: string
    shareCount: number
    investorPoolPercent: number
    grossProfitShare: number
    deductedLoan: number
    reinvestedAmount: number
    netCashPayout: number
    payoutMethod: 'cash' | 'reinvest' | 'mixed'
  }>
}

