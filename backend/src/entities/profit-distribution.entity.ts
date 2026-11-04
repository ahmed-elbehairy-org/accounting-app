import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('profit_distributions')
export class ProfitDistributionEntity extends BaseAppEntity {
  @Column()
  projectId: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalProfit: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  distributedAmount: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  retainedAmount: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  workerCut: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  investorPool: number

  @Column()
  distributionDate: string

  @Column({ default: 'draft' })
  status: 'draft' | 'approved'

  @Column({ default: '' })
  notes: string
}

