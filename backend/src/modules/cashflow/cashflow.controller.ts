import { Controller, Get, Post, Delete, Patch, Param, Query, Body } from '@nestjs/common'
import { CashflowService } from './cashflow.service'
import { CashflowEntity } from '../../entities/cashflow.entity'

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

  @Get('trash')
  getTrash() {
    return this.service.findDeleted()
  }

  @Post()
  create(@Body() body: Partial<CashflowEntity>) {
    return this.service.create(body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id)
  }

  @Delete(':id/permanent')
  hardRemove(@Param('id') id: string) {
    return this.service.hardDelete(id)
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(id)
  }
}
