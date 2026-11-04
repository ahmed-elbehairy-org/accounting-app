import { Controller, Get, Post, Delete, Patch, Param, Query, Body } from '@nestjs/common'
import { LiquidationsService } from './liquidations.service'

@Controller('api/liquidations')
export class LiquidationsController {
  constructor(private readonly service: LiquidationsService) {}

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
  preview(@Body() body: { projectId: string; finalAssetValue: number }) {
    return this.service.preview(body.projectId, body.finalAssetValue)
  }

  @Post('execute')
  execute(@Body() body: { projectId: string; finalAssetValue: number; notes?: string }) {
    return this.service.execute(body.projectId, body.finalAssetValue, body.notes)
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
