import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ensureDatabaseExists } from './ensure-db'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        const host = cfg.get<string>('DB_HOST', 'localhost')
        const port = Number(cfg.get<number>('DB_PORT', 5432))
        const username = cfg.get<string>('DB_USERNAME', 'postgres')
        const password = cfg.get<string>('DB_PASSWORD', 'postgres')
        const database = cfg.get<string>('DB_DATABASE', 'accounting')

        await ensureDatabaseExists({ host, port, user: username, password, database })

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: cfg.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
          logging: false
        }
      }
    })
  ]
})
export class DatabaseModule {}
