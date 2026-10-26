import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductEntity } from '../../entities/product.entity'
import { ProductCostItemEntity } from '../../entities/product-cost-item.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly prodRepo: Repository<ProductEntity>,
    @InjectRepository(ProductCostItemEntity)
    private readonly costRepo: Repository<ProductCostItemEntity>
  ) {}

  findAll(projectId?: string): Promise<ProductEntity[]> {
    if (projectId) return this.prodRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } })
    return this.prodRepo.find({ order: { createdAt: 'DESC' } })
  }

  create(dto: {
    projectId: string
    name: string
    sku?: string
    unitsProduced?: number
    targetSellingPrice?: number
    notes?: string
  }): Promise<ProductEntity> {
    const prod = this.prodRepo.create({
      id: `prod-${Date.now()}`,
      projectId: dto.projectId,
      name: dto.name.trim(),
      sku: (dto.sku || `SKU-${Date.now().toString().slice(-4)}`).trim().toUpperCase(),
      unitsProduced: Number(dto.unitsProduced) || 1,
      targetSellingPrice: Number(dto.targetSellingPrice) || 0,
      notes: (dto.notes || '').trim()
    })
    return this.prodRepo.save(prod)
  }

  async addCostItem(productId: string, dto: {
    costType: string
    allocatedAmount: number
    cashflowId?: string
  }): Promise<ProductCostItemEntity> {
    const prod = await this.prodRepo.findOne({ where: { id: productId } })
    if (!prod) throw new NotFoundException('Product not found')

    const item = this.costRepo.create({
      id: `pci-${Date.now()}`,
      productId,
      cashflowId: dto.cashflowId,
      costType: dto.costType.trim(),
      allocatedAmount: Number(dto.allocatedAmount)
    })
    return this.costRepo.save(item)
  }

  async getProductCostSheet(productId: string) {
    const product = await this.prodRepo.findOne({ where: { id: productId } })
    if (!product) throw new NotFoundException('Product not found')

    const costItems = await this.costRepo.find({ where: { productId } })
    const totalCost = costItems.reduce((sum, item) => sum + Number(item.allocatedAmount), 0)
    const units = Math.max(1, product.unitsProduced)
    const unitCost = totalCost / units
    const sellingPrice = Number(product.targetSellingPrice)
    const profitPerUnit = sellingPrice - unitCost
    const marginPercent = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0

    return { product, costItems, totalCost, unitCost, profitPerUnit, marginPercent }
  }
}
