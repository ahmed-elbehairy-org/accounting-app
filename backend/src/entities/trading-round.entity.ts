import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('trading_rounds')
export class TradingRoundEntity {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column()
  startDate: string

  @Column({ nullable: true })
  endDate?: string

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 1000 })
  shareUnitPrice: number

  @Column({ type: 'int', default: 100 })
  targetShares: number

  @Column({ type: 'int', default: 0 })
  totalAllocatedShares: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 25 })
  managerProfitCutPercent: number

  @Column({ default: 'active' })
  status: 'active' | 'in_liquidation' | 'liquidated'

  @Column({ default: '' })
  description: string

  @CreateDateColumn()
  createdAt: Date
}
