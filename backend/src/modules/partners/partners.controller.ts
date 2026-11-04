import { Controller, Get, Post, Delete, Patch, Param, Body } from '@nestjs/common'
import { PartnersService } from './partners.service'
import { PartnerEntity } from '../../entities/partner.entity'

@Controller('api/partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get('stats')
  getStats() {
    return this.service.getStats()
  }

  @Get('trash')
  getTrash() {
    return this.service.findDeleted()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Get(':id/statement')
  getStatement(@Param('id') id: string) {
    return this.service.getStatement(id)
  }

  @Post()
  create(@Body() body: Partial<PartnerEntity>) {
    return this.service.create(body)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<PartnerEntity>) {
    return this.service.update(id, body)
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
