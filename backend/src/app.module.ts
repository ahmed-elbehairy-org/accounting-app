import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { PartnersModule } from './modules/partners/partners.module'
import { ProjectsModule } from './modules/projects/projects.module'
import { CashflowModule } from './modules/cashflow/cashflow.module'
import { LiquidationsModule } from './modules/liquidations/liquidations.module'
import { AdvancesModule } from './modules/advances/advances.module'
import { DistributionsModule } from './modules/distributions/distributions.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['backend/.env', '.env'] }),
    DatabaseModule,
    PartnersModule,
    ProjectsModule,
    CashflowModule,
    LiquidationsModule,
    AdvancesModule,
    DistributionsModule
  ]
})
export class AppModule {}
