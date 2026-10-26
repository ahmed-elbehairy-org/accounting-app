import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TradingRoundEntity } from '../../entities/trading-round.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { PartnerEntity } from '../../entities/partner.entity'

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(TradingRoundEntity)
    private readonly roundRepo: Repository<TradingRoundEntity>,
    @InjectRepository(ShareInvestmentEntity)
    private readonly invRepo: Repository<ShareInvestmentEntity>,
    @InjectRepository(PartnerEntity)
    private readonly partnerRepo: Repository<PartnerEntity>
  ) {}

  findAll(): Promise<TradingRoundEntity[]> {
    return this.roundRepo.find({ order: { createdAt: 'DESC' } })
  }

  create(dto: Partial<TradingRoundEntity>): Promise<TradingRoundEntity> {
    const round = this.roundRepo.create({
      ...dto,
      id: `r-${Date.now()}`,
      startDate: new Date().toISOString().split('T')[0],
      totalAllocatedShares: 0,
      status: 'active'
    })
    return this.roundRepo.save(round)
  }

  async allocateShares(roundId: string, partnerId: string, shareCount: number) {
    const round = await this.roundRepo.findOne({ where: { id: roundId } })
    const partner = await this.partnerRepo.findOne({ where: { id: partnerId } })
    if (!round || !partner) throw new NotFoundException('Round or Partner not found')

    const count = Number(shareCount)
    const totalAmount = count * Number(round.shareUnitPrice)

    const inv = this.invRepo.create({
      id: `inv-${Date.now()}`,
      partnerId,
      roundId,
      shareCount: count,
      shareUnitPrice: round.shareUnitPrice,
      totalAmount,
      date: new Date().toISOString().split('T')[0]
    })

    round.totalAllocatedShares += count
    partner.activeSharesCount += count
    partner.totalInvestedCapital = Number(partner.totalInvestedCapital) + totalAmount

    await this.invRepo.save(inv)
    await this.roundRepo.save(round)
    await this.partnerRepo.save(partner)

    return { investment: inv, round, partner }
  }
}
