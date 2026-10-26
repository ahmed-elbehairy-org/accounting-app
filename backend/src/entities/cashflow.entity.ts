import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('cashflows')
export class CashflowEntity {
  @PrimaryColumn()
  id: string

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

  @Column({ nullable: true })
  linkedProductId?: string

  @CreateDateColumn()
  createdAt: Date
}
