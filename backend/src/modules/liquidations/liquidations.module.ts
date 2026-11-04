import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LiquidationEntity } from '../../entities/liquidation.entity'
import { SettlementPayoutEntity } from '../../entities/settlement-payout.entity'
import { ProjectEntity } from '../../entities/project.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { CashflowEntity } from '../../entities/cashflow.entity'
import { LiquidationsService } from './liquidations.service'
import { LiquidationsController } from './liquidations.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LiquidationEntity,
      SettlementPayoutEntity,
      ProjectEntity,
      PartnerEntity,
      ShareInvestmentEntity,
      CashflowEntity
    ])
  ],
  controllers: [LiquidationsController],
  providers: [LiquidationsService],
  exports: [LiquidationsService]
})
export class LiquidationsModule {}
