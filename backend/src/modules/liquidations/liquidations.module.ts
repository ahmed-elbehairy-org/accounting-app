import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LiquidationEntity } from '../../entities/liquidation.entity'
import { SettlementPayoutEntity } from '../../entities/settlement-payout.entity'
import { TradingRoundEntity } from '../../entities/trading-round.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { LiquidationsService } from './liquidations.service'
import { LiquidationsController } from './liquidations.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LiquidationEntity,
      SettlementPayoutEntity,
      TradingRoundEntity,
      ShareInvestmentEntity,
      PartnerEntity,
      AdvanceLoanEntity
    ])
  ],
  controllers: [LiquidationsController],
  providers: [LiquidationsService],
  exports: [LiquidationsService]
})
export class LiquidationsModule {}
