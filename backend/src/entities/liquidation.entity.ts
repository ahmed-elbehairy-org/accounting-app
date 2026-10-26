import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('liquidations')
export class LiquidationEntity {
  @PrimaryColumn()
  id: string

  @Column()
  roundId: string

  @Column()
  liquidationDate: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  initialCapital: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  finalAssetValue: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grossProfitOrLoss: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  managerProfit: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  investorsProfitPool: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  returnPerShare: number

  @Column({ default: '' })
  notes: string

  @CreateDateColumn()
  createdAt: Date
}
