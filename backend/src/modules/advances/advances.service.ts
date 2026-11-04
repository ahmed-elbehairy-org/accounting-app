import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { BaseService } from '../../common/base.service'

@Injectable()
export class AdvancesService extends BaseService<AdvanceLoanEntity> {
  constructor(
    @InjectRepository(AdvanceLoanEntity)
    repo: Repository<AdvanceLoanEntity>,
    @InjectRepository(PartnerEntity)
    private readonly partnerRepo: Repository<PartnerEntity>
  ) {
    super(repo)
  }

  findAll(): Promise<AdvanceLoanEntity[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } })
  }

  async create(dto: Partial<AdvanceLoanEntity>): Promise<AdvanceLoanEntity> {
    const amount = Number(dto.amount) || 0
    const adv = this.repository.create({
      ...dto,
      amount,
      status: 'open',
      date: dto.date || new Date().toISOString().split('T')[0],
      settledAmount: 0
    })
    const saved = await this.repository.save(adv)

    if (dto.partnerId) {
      const partner = await this.partnerRepo.findOne({ where: { id: dto.partnerId } })
      if (partner) {
        partner.outstandingLoans = Number(partner.outstandingLoans || 0) + amount
        await this.partnerRepo.save(partner)
      }
    }
    return saved
  }
}
