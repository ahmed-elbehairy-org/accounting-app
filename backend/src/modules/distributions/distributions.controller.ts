import { Controller, Get, Post, Delete, Patch, Param, Query, Body } from '@nestjs/common'
import { DistributionsService } from './distributions.service'

@Controller('api/distributions')
export class DistributionsController {
  constructor(private readonly service: DistributionsService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    if (projectId) {
      return (this.service as any).repository.find({ where: { projectId }, order: { createdAt: 'DESC' } })
    }
    return this.service.findAll()
  }

  @Get('trash')
  getTrash() {
    return this.service.findDeleted()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Get(':id/payouts')
  getPayouts(@Param('id') id: string) {
    return this.service.getPayouts(id)
  }

  @Post('preview')
  preview(@Body() body: any) {
    return this.service.preview(body)
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body)
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approve(id)
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

