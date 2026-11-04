import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST', 'localhost'),
        port: Number(cfg.get<number>('DB_PORT', 5432)),
        username: cfg.get<string>('DB_USERNAME', 'postgres'),
        password: cfg.get<string>('DB_PASSWORD', 'postgres'),
        database: cfg.get<string>('DB_DATABASE', 'accounting'),
        autoLoadEntities: true,
        synchronize: cfg.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        logging: false
      })
    })
  ]
})
export class DatabaseModule {}

