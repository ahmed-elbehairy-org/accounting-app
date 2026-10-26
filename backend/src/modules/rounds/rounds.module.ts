import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TradingRoundEntity } from '../../entities/trading-round.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { RoundsService } from './rounds.service'
import { RoundsController } from './rounds.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradingRoundEntity,
      ShareInvestmentEntity,
      PartnerEntity
    ])
  ],
  controllers: [RoundsController],
  providers: [RoundsService],
  exports: [RoundsService]
})
export class RoundsModule {}
