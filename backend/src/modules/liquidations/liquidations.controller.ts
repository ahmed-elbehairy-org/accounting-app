import { Controller, Get, Post, Body } from '@nestjs/common'
import { LiquidationsService } from './liquidations.service'

@Controller('api/liquidations')
export class LiquidationsController {
  constructor(private readonly service: LiquidationsService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get('state')
  getFullState() {
    return this.service.getFullState()
  }

  @Post('execute')
  execute(
    @Body() body: { roundId: string; finalAssetValue: number; notes?: string }
  ) {
    return this.service.execute(body.roundId, body.finalAssetValue, body.notes)
  }
}
