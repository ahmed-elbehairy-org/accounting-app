import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfitDistributionEntity } from '../../entities/profit-distribution.entity'
import { PartnerPayoutEntity } from '../../entities/partner-payout.entity'
import { ProjectEntity } from '../../entities/project.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { CashflowEntity } from '../../entities/cashflow.entity'
import { DistributionsService } from './distributions.service'
import { DistributionsController } from './distributions.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfitDistributionEntity,
      PartnerPayoutEntity,
      ProjectEntity,
      PartnerEntity,
      ShareInvestmentEntity,
      CashflowEntity
    ])
  ],
  controllers: [DistributionsController],
  providers: [DistributionsService],
  exports: [DistributionsService]
})
export class DistributionsModule {}
