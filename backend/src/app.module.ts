import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { PartnersModule } from './modules/partners/partners.module'
import { RoundsModule } from './modules/rounds/rounds.module'
import { AdvancesModule } from './modules/advances/advances.module'
import { LiquidationsModule } from './modules/liquidations/liquidations.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PartnersModule,
    RoundsModule,
    AdvancesModule,
    LiquidationsModule
  ]
})
export class AppModule {}
