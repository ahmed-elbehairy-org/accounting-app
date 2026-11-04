import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('settlement_payouts')
export class SettlementPayoutEntity extends BaseAppEntity {
  @Column()
  liquidationId: string

  @Column()
  projectId: string

  @Column()
  partnerId: string

  @Column({ type: 'int' })
  sharesCount: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  capitalReturned: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  profitShare: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grossEntitlement: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  deductedAdvances: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netPayable: number

  @Column({ default: false })
  paid: boolean
}

