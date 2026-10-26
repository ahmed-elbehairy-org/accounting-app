import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('share_investments')
export class ShareInvestmentEntity {
  @PrimaryColumn()
  id: string

  @Column()
  partnerId: string

  @Column()
  roundId: string

  @Column({ type: 'int' })
  shareCount: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  shareUnitPrice: number

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number

  @Column()
  date: string

  @CreateDateColumn()
  createdAt: Date
}
