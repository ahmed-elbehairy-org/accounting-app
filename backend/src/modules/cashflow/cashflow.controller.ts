import { Controller, Get, Post, Query, Body } from '@nestjs/common'
import { CashflowService } from './cashflow.service'

@Controller('api/cashflow')
export class CashflowController {
  constructor(private readonly service: CashflowService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.service.findAll(projectId)
  }

  @Get('summary')
  getSummary(@Query('projectId') projectId?: string) {
    return this.service.getSummary(projectId)
  }

  @Post()
  create(
    @Body()
    body: {
      projectId: string
      type: 'inflow' | 'outflow'
      category?: string
      amount: number
      entryDate?: string
      description?: string
      linkedProductId?: string
    }
  ) {
    return this.service.create(body)
  }
}
