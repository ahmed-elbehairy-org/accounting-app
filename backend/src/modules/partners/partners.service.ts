import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PartnerEntity } from '../../entities/partner.entity'

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(PartnerEntity)
    private readonly repo: Repository<PartnerEntity>
  ) {}

  findAll(): Promise<PartnerEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string): Promise<PartnerEntity> {
    const partner = await this.repo.findOne({ where: { id } })
    if (!partner) throw new NotFoundException('Partner not found')
    return partner
  }

  create(dto: { name: string; phone?: string; notes?: string }): Promise<PartnerEntity> {
    const entity = this.repo.create({
      id: `p-${Date.now()}`,
      name: dto.name.trim(),
      phone: (dto.phone || '').trim(),
      notes: (dto.notes || '').trim(),
      joinedDate: new Date().toISOString().split('T')[0],
      activeSharesCount: 0,
      totalInvestedCapital: 0,
      outstandingLoans: 0
    })
    return this.repo.save(entity)
  }
}
