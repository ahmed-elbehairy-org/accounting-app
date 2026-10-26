import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('projects')
export class ProjectEntity {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  code: string

  @Column({ default: '' })
  description: string

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'paused'

  @CreateDateColumn()
  createdAt: Date
}
