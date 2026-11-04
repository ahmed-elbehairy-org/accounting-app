import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PartnerEntity } from '../../entities/partner.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { PartnerPayoutEntity } from '../../entities/partner-payout.entity'
import { ProjectEntity } from '../../entities/project.entity'
import { PartnersService } from './partners.service'
import { PartnersController } from './partners.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PartnerEntity,
      ShareInvestmentEntity,
      AdvanceLoanEntity,
      PartnerPayoutEntity,
      ProjectEntity
    ])
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService]
})
export class PartnersModule {}
