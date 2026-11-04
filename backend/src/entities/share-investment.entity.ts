import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('share_investments')
export class ShareInvestmentEntity extends BaseAppEntity {
  @Column()
  partnerId: string

  @Column()
  projectId: string

  @Column({ type: 'int' })
  shareCount: number

  @Column({ type: 'decimal', precision: 14, scale: 4 })
  shareUnitPrice: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number

  @Column()
  date: string
}

