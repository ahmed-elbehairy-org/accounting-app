import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CashflowEntity } from '../../entities/cashflow.entity'
import { BaseService } from '../../common/base.service'
import { computeCashflowSummary, CashflowSummary } from './cashflow.calculator'

@Injectable()
export class CashflowService extends BaseService<CashflowEntity> {
  constructor(
    @InjectRepository(CashflowEntity)
    repo: Repository<CashflowEntity>
  ) {
    super(repo)
  }

  findAll(projectId?: string): Promise<CashflowEntity[]> {
    if (projectId) {
      return this.repository.find({ where: { projectId }, order: { entryDate: 'DESC', createdAt: 'DESC' } })
    }
    return this.repository.find({ order: { entryDate: 'DESC', createdAt: 'DESC' } })
  }

  async getSummary(projectId?: string): Promise<CashflowSummary> {
    const items = await this.findAll(projectId)
    return computeCashflowSummary(items)
  }

  create(dto: Partial<CashflowEntity>): Promise<CashflowEntity> {
    const item = this.repository.create({
      ...dto,
      amount: Number(dto.amount),
      category: dto.category || 'عام',
      entryDate: dto.entryDate || new Date().toISOString().split('T')[0]
    })
    return this.repository.save(item)
  }
}
