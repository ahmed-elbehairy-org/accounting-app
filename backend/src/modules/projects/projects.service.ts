import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectEntity } from '../../entities/project.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { PartnerEntity } from '../../entities/partner.entity'
import { CashflowEntity } from '../../entities/cashflow.entity'
import { BaseService } from '../../common/base.service'
import { computeProjectStats } from './projects.calculator'

@Injectable()
export class ProjectsService extends BaseService<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity) repo: Repository<ProjectEntity>,
    @InjectRepository(ShareInvestmentEntity) private readonly shareRepo: Repository<ShareInvestmentEntity>,
    @InjectRepository(PartnerEntity) private readonly partnerRepo: Repository<PartnerEntity>,
    @InjectRepository(CashflowEntity) private readonly cashflowRepo: Repository<CashflowEntity>
  ) { super(repo) }

  findAll(): Promise<ProjectEntity[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } })
  }

  create(dto: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const p = this.repository.create({
      ...dto,
      code: (dto.code || `PRJ-${Date.now().toString().slice(-4)}`).toUpperCase(),
      startDate: dto.startDate || new Date().toISOString().split('T')[0],
      status: 'active'
    })
    return this.repository.save(p)
  }

  getInvestments(projectId: string): Promise<ShareInvestmentEntity[]> {
    return this.shareRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } })
  }

  async getStats(projectId: string) {
    const project = await this.repository.findOne({ where: { id: projectId } })
    if (!project) throw new NotFoundException('المشروع غير موجود')
    const investments = await this.shareRepo.find({ where: { projectId } })
    return { project, stats: computeProjectStats(project, investments) }
  }

  async allocateShares(projectId: string, dto: { partnerId: string; shareCount: number; date?: string }) {
    const project = await this.repository.findOne({ where: { id: projectId } })
    if (!project) throw new NotFoundException('المشروع غير موجود')
    const partner = await this.partnerRepo.findOne({ where: { id: dto.partnerId } })
    if (!partner) throw new NotFoundException('الشريك غير موجود')

    const shareCount = Number(dto.shareCount)
    const unitPrice = Number(project.shareUnitPrice)
    const totalAmount = shareCount * unitPrice
    const entryDate = dto.date || new Date().toISOString().split('T')[0]

    const savedInv = await this.shareRepo.save(this.shareRepo.create({
      projectId, partnerId: partner.id, shareCount, shareUnitPrice: unitPrice, totalAmount, date: entryDate
    }))

    await this.cashflowRepo.save(this.cashflowRepo.create({
      projectId, type: 'inflow', category: 'اكتتاب أسهم', amount: totalAmount, entryDate,
      description: `اكتتاب ${shareCount} سهم للشريك ${partner.name || partner.id}`
    }))

    project.totalAllocatedShares = Number(project.totalAllocatedShares || 0) + shareCount
    await this.repository.save(project)

    partner.activeSharesCount = Number(partner.activeSharesCount || 0) + shareCount
    partner.totalInvestedCapital = Number(partner.totalInvestedCapital || 0) + totalAmount
    await this.partnerRepo.save(partner)

    return savedInv
  }
}
