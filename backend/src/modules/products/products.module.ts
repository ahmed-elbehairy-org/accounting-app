import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from '../../entities/product.entity'
import { ProductCostItemEntity } from '../../entities/product-cost-item.entity'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductCostItemEntity])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
