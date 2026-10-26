import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common'
import { ProductsService } from './products.service'

@Controller('api/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.service.findAll(projectId)
  }

  @Get(':id/cost-sheet')
  getCostSheet(@Param('id') id: string) {
    return this.service.getProductCostSheet(id)
  }

  @Post()
  create(
    @Body()
    body: {
      projectId: string
      name: string
      sku?: string
      unitsProduced?: number
      targetSellingPrice?: number
      notes?: string
    }
  ) {
    return this.service.create(body)
  }

  @Post(':id/cost-items')
  addCostItem(
    @Param('id') id: string,
    @Body() body: { costType: string; allocatedAmount: number; cashflowId?: string }
  ) {
    return this.service.addCostItem(id, body)
  }
}
