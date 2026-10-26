import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('advance_loans')
export class AdvanceLoanEntity {
  @PrimaryColumn()
  id: string

  @Column()
  partnerId: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number

  @Column({ default: 'profit_advance' })
  deductionType: 'profit_advance' | 'capital_deduction'

  @Column({ default: 'open' })
  status: 'open' | 'partially_settled' | 'settled'

  @Column()
  date: string

  @Column({ default: '' })
  reason: string

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  settledAmount: number

  @CreateDateColumn()
  createdAt: Date
}
