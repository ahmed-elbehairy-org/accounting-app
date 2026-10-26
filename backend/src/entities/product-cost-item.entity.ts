import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('product_cost_items')
export class ProductCostItemEntity {
  @PrimaryColumn()
  id: string

  @Column()
  productId: string

  @Column({ nullable: true })
  cashflowId?: string

  @Column()
  costType: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  allocatedAmount: number

  @CreateDateColumn()
  createdAt: Date
}
