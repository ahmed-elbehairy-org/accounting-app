import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { PartnerEntity } from '../../entities/partner.entity'

@Injectable()
export class AdvancesService {
  constructor(
    @InjectRepository(AdvanceLoanEntity)
    private readonly advRepo: Repository<AdvanceLoanEntity>,
    @InjectRepository(PartnerEntity)
    private readonly partnerRepo: Repository<PartnerEntity>
  ) {}

  findAll(): Promise<AdvanceLoanEntity[]> {
    return this.advRepo.find({ order: { createdAt: 'DESC' } })
  }

  async create(dto: {
    partnerId: string
    amount: number
    deductionType: 'profit_advance' | 'capital_deduction'
    reason?: string
  }): Promise<AdvanceLoanEntity> {
    const partner = await this.partnerRepo.findOne({ where: { id: dto.partnerId } })
    if (!partner) throw new NotFoundException('Partner not found')

    const amount = Number(dto.amount)
    const entity = this.advRepo.create({
      id: `adv-${Date.now()}`,
      partnerId: dto.partnerId,
      amount,
      deductionType: dto.deductionType || 'profit_advance',
      reason: (dto.reason || '').trim(),
      status: 'open',
      date: new Date().toISOString().split('T')[0],
      settledAmount: 0
    })

    partner.outstandingLoans = Number(partner.outstandingLoans) + amount
    await this.partnerRepo.save(partner)
    return this.advRepo.save(entity)
  }

  async settle(id: string): Promise<AdvanceLoanEntity> {
    const adv = await this.advRepo.findOne({ where: { id } })
    if (!adv) throw new NotFoundException('Advance not found')

    const partner = await this.partnerRepo.findOne({ where: { id: adv.partnerId } })
    if (partner && adv.status === 'open') {
      partner.outstandingLoans = Math.max(0, Number(partner.outstandingLoans) - Number(adv.amount))
      await this.partnerRepo.save(partner)
    }

    adv.status = 'settled'
    adv.settledAmount = adv.amount
    return this.advRepo.save(adv)
  }
}
