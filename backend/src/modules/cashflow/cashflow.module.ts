import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CashflowEntity } from '../../entities/cashflow.entity'
import { CashflowService } from './cashflow.service'
import { CashflowController } from './cashflow.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CashflowEntity])],
  controllers: [CashflowController],
  providers: [CashflowService],
  exports: [CashflowService]
})
export class CashflowModule {}
