import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { RoundsService } from './rounds.service'
import { TradingRoundEntity } from '../../entities/trading-round.entity'

@Controller('api/rounds')
export class RoundsController {
  constructor(private readonly service: RoundsService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Post()
  create(@Body() body: Partial<TradingRoundEntity>) {
    return this.service.create(body)
  }

  @Post(':id/allocate')
  allocate(
    @Param('id') id: string,
    @Body() body: { partnerId: string; shareCount: number }
  ) {
    return this.service.allocateShares(id, body.partnerId, body.shareCount)
  }
}
