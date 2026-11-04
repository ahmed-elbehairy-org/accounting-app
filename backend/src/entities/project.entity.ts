import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('projects')
export class ProjectEntity extends BaseAppEntity {
  @Column()
  name: string

  @Column({ unique: true })
  code: string

  @Column({ default: '' })
  description: string

  @Column({ default: 'active' })
  status: 'active' | 'liquidated'

  @Column({ type: 'decimal', precision: 14, scale: 4, default: 1000 })
  shareUnitPrice: number

  @Column({ type: 'int', default: 100 })
  targetShares: number

  @Column({ type: 'int', default: 0 })
  totalAllocatedShares: number

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 })
  workerProfitPercentage: number

  @Column({ default: 'العامل' })
  workerName: string

  @Column()
  startDate: string

  @Column({ nullable: true })
  endDate?: string
}

