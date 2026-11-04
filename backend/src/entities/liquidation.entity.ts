import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('liquidations')
export class LiquidationEntity extends BaseAppEntity {
  @Column()
  projectId: string

  @Column()
  liquidationDate: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  initialCapital: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  finalAssetValue: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grossProfitOrLoss: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  workerProfit: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  investorsProfitPool: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  returnPerShare: number

  @Column({ default: '' })
  notes: string
}

