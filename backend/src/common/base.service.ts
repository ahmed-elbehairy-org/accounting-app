import { NotFoundException } from '@nestjs/common'
import { Repository, ObjectLiteral, Not, IsNull } from 'typeorm'

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } } as any)
  }

  async findOne(id: string): Promise<T> {
    const item = await this.repository.findOne({ where: { id } as any })
    if (!item) throw new NotFoundException('Element not found')
    return item
  }

  findDeleted(): Promise<T[]> {
    return this.repository.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) } as any,
      order: { deletedAt: 'DESC' } as any
    })
  }

  async softDelete(id: string): Promise<void> {
    const res = await this.repository.softDelete(id)
    if (!res.affected) throw new NotFoundException('Element not found')
  }

  async restore(id: string): Promise<void> {
    const res = await this.repository.restore(id)
    if (!res.affected) throw new NotFoundException('Element not found')
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    const item = await this.findOne(id)
    Object.assign(item, dto)
    return this.repository.save(item)
  }

  async hardDelete(id: string): Promise<void> {
    const res = await this.repository.delete(id)
    if (!res.affected) throw new NotFoundException('Element not found')
  }
}
