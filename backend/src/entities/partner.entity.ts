import { Entity, Column } from 'typeorm'
import { BaseAppEntity } from './base.entity'

@Entity('partners')
export class PartnerEntity extends BaseAppEntity {
  @Column()
  name: string

  @Column({ default: '' })
  phone: string

  @Column({ default: '' })
  notes: string

  @Column()
  joinedDate: string

  @Column({ type: 'int', default: 0 })
  activeSharesCount: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalInvestedCapital: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  outstandingLoans: number
}

