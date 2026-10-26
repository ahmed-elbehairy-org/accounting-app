import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CashflowEntity } from '../../entities/cashflow.entity'

@Injectable()
export class CashflowService {
  constructor(
    @InjectRepository(CashflowEntity)
    private readonly repo: Repository<CashflowEntity>
  ) {}

  findAll(projectId?: string): Promise<CashflowEntity[]> {
    if (projectId) {
      return this.repo.find({ where: { projectId }, order: { createdAt: 'DESC' } })
    }
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async getSummary(projectId?: string) {
    const list = await this.findAll(projectId)
    const totalInflow = list
      .filter((c) => c.type === 'inflow')
      .reduce((sum, c) => sum + Number(c.amount), 0)
    const totalOutflow = list
      .filter((c) => c.type === 'outflow')
      .reduce((sum, c) => sum + Number(c.amount), 0)

    return {
      totalInflow,
      totalOutflow,
      netBalance: totalInflow - totalOutflow,
      count: list.length
    }
  }

  create(dto: {
    projectId: string
    type: 'inflow' | 'outflow'
    category?: string
    amount: number
    entryDate?: string
    description?: string
    linkedProductId?: string
  }): Promise<CashflowEntity> {
    if (!dto.projectId || !dto.amount) {
      throw new BadRequestException('Project and amount are required')
    }

    const item = this.repo.create({
      id: `cf-${Date.now()}`,
      projectId: dto.projectId,
      type: dto.type,
      category: dto.category || 'general',
      amount: Number(dto.amount),
      entryDate: dto.entryDate || new Date().toISOString().split('T')[0],
      description: (dto.description || '').trim(),
      linkedProductId: dto.linkedProductId
    })
    return this.repo.save(item)
  }
}
