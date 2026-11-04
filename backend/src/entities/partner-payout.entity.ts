import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('partner_payouts')
export class PartnerPayoutEntity extends BaseAppEntity {
  @Column()
  distributionId: string

  @Column()
  projectId: string

  @Column()
  partnerId: string

  @Column({ type: 'int' })
  shareCount: number

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  investorPoolPercent: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grossProfitShare: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  deductedLoan: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  reinvestedAmount: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netCashPayout: number

  @Column({ default: 'cash' })
  payoutMethod: 'cash' | 'reinvest' | 'mixed'

  @Column({ default: 'pending' })
  status: 'pending' | 'paid'
}

