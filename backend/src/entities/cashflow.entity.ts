import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('cashflows')
export class CashflowEntity extends BaseAppEntity {
  @Column()
  projectId: string

  @Column()
  type: 'inflow' | 'outflow'

  @Column({ default: 'general' })
  category: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number

  @Column()
  entryDate: string

  @Column({ default: '' })
  description: string
}

