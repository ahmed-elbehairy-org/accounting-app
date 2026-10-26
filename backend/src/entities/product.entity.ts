import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id: string

  @Column()
  projectId: string

  @Column()
  name: string

  @Column({ default: '' })
  sku: string

  @Column({ type: 'int', default: 1 })
  unitsProduced: number

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  targetSellingPrice: number

  @Column({ default: '' })
  notes: string

  @CreateDateColumn()
  createdAt: Date
}
