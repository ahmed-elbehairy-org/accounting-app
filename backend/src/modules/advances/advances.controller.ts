import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common'
import { AdvancesService } from './advances.service'

@Controller('api/advances')
export class AdvancesController {
  constructor(private readonly service: AdvancesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Post()
  create(
    @Body()
    body: {
      partnerId: string
      amount: number
      deductionType: 'profit_advance' | 'capital_deduction'
      reason?: string
    }
  ) {
    return this.service.create(body)
  }

  @Patch(':id/settle')
  settle(@Param('id') id: string) {
    return this.service.settle(id)
  }
}
