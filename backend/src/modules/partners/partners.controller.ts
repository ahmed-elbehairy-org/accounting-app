import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { PartnersService } from './partners.service'

@Controller('api/partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() body: { name: string; phone?: string; notes?: string }) {
    return this.service.create(body)
  }
}
