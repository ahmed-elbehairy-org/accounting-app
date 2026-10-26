import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LiquidationEntity } from '../../entities/liquidation.entity'
import { SettlementPayoutEntity } from '../../entities/settlement-payout.entity'
import { TradingRoundEntity } from '../../entities/trading-round.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { computePartnerPayouts } from './liquidation.calculator'

@Injectable()
export class LiquidationsService {
  constructor(
    @InjectRepository(LiquidationEntity)
    private readonly liqRepo: Repository<LiquidationEntity>,
    @InjectRepository(SettlementPayoutEntity)
    private readonly payoutRepo: Repository<SettlementPayoutEntity>,
    @InjectRepository(TradingRoundEntity)
    private readonly roundRepo: Repository<TradingRoundEntity>,
    @InjectRepository(ShareInvestmentEntity)
    private readonly invRepo: Repository<ShareInvestmentEntity>,
    @InjectRepository(PartnerEntity)
    private readonly partnerRepo: Repository<PartnerEntity>,
    @InjectRepository(AdvanceLoanEntity)
    private readonly advRepo: Repository<AdvanceLoanEntity>
  ) {}

  async findAll() {
    const liquidations = await this.liqRepo.find({ order: { createdAt: 'DESC' } })
    const settlements = await this.payoutRepo.find({ order: { createdAt: 'DESC' } })
    return { liquidations, settlements }
  }

  async getFullState() {
    const [partners, rounds, investments, advances, liquidations, settlements] = await Promise.all([
      this.partnerRepo.find({ order: { createdAt: 'DESC' } }),
      this.roundRepo.find({ order: { createdAt: 'DESC' } }),
      this.invRepo.find({ order: { createdAt: 'DESC' } }),
      this.advRepo.find({ order: { createdAt: 'DESC' } }),
      this.liqRepo.find({ order: { createdAt: 'DESC' } }),
      this.payoutRepo.find({ order: { createdAt: 'DESC' } })
    ])
    return { partners, rounds, investments, advances, liquidations, settlements }
  }

  async execute(roundId: string, finalAssetValue: number, notes?: string) {
    const round = await this.roundRepo.findOne({ where: { id: roundId } })
    if (!round) throw new NotFoundException('Round not found')

    const roundInvs = await this.invRepo.find({ where: { roundId } })
    const partners = await this.partnerRepo.find()
    const openAdvances = await this.advRepo.find({ where: { status: 'open' } })

    const totalShares = roundInvs.reduce((sum, i) => sum + i.shareCount, 0)
    const initialCapital = roundInvs.reduce((sum, i) => sum + Number(i.totalAmount), 0)
    const assetVal = Number(finalAssetValue)
    const grossProfit = assetVal - initialCapital
    const isProfit = grossProfit > 0
    const managerProfit = isProfit ? grossProfit * (Number(round.managerProfitCutPercent) / 100) : 0
    const investorsProfitPool = isProfit ? grossProfit - managerProfit : grossProfit
    const profitPerShare = totalShares > 0 ? investorsProfitPool / totalShares : 0
    const date = new Date().toISOString().split('T')[0]
    const liqId = `liq-${Date.now()}`

    const liquidation = this.liqRepo.create({
      id: liqId, roundId, liquidationDate: date, initialCapital, finalAssetValue: assetVal,
      grossProfitOrLoss: grossProfit, managerProfit, investorsProfitPool,
      returnPerShare: totalShares > 0 ? assetVal / totalShares : 0, notes: notes || ''
    })

    const payouts = computePartnerPayouts({
      liqId, roundId, isProfit, profitPerShare, roundInvs, partners, openAdvances
    })

    round.status = 'liquidated'
    round.endDate = date

    await this.liqRepo.save(liquidation)
    await this.payoutRepo.save(payouts)
    await this.roundRepo.save(round)
    await this.partnerRepo.save(partners)

    return { liquidation, settlements: payouts }
  }
}
