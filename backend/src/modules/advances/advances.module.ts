import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { AdvancesService } from './advances.service'
import { AdvancesController } from './advances.controller'

@Module({
  imports: [TypeOrmModule.forFeature([AdvanceLoanEntity, PartnerEntity])],
  controllers: [AdvancesController],
  providers: [AdvancesService],
  exports: [AdvancesService]
})
export class AdvancesModule {}
