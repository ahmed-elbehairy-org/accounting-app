import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PartnerEntity } from '../entities/partner.entity'
import { TradingRoundEntity } from '../entities/trading-round.entity'
import { ShareInvestmentEntity } from '../entities/share-investment.entity'
import { AdvanceLoanEntity } from '../entities/advance-loan.entity'
import { LiquidationEntity } from '../entities/liquidation.entity'
import { SettlementPayoutEntity } from '../entities/settlement-payout.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST', 'localhost'),
        port: cfg.get<number>('DB_PORT', 5432),
        username: cfg.get<string>('DB_USERNAME', 'postgres'),
        password: cfg.get<string>('DB_PASSWORD', 'postgres'),
        database: cfg.get<string>('DB_DATABASE', 'accounting_db'),
        entities: [
          PartnerEntity,
          TradingRoundEntity,
          ShareInvestmentEntity,
          AdvanceLoanEntity,
          LiquidationEntity,
          SettlementPayoutEntity
        ],
        synchronize: cfg.get<boolean>('DB_SYNCHRONIZE', true),
        logging: false
      })
    })
  ]
})
export class DatabaseModule {}
