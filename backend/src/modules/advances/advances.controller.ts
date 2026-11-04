import { Controller, Get, Post, Delete, Patch, Param, Body } from '@nestjs/common'
import { AdvancesService } from './advances.service'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'

@Controller('api/advances')
export class AdvancesController {
  constructor(private readonly service: AdvancesService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get('trash')
  getTrash() {
    return this.service.findDeleted()
  }

  @Post()
  create(@Body() body: Partial<AdvanceLoanEntity>) {
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
