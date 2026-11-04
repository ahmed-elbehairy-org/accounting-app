import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PartnerEntity } from '../../entities/partner.entity'
import { ShareInvestmentEntity } from '../../entities/share-investment.entity'
import { AdvanceLoanEntity } from '../../entities/advance-loan.entity'
import { PartnerPayoutEntity } from '../../entities/partner-payout.entity'
import { ProjectEntity } from '../../entities/project.entity'
import { BaseService } from '../../common/base.service'
import { buildPartnerStatement } from './partner-statement.builder'

@Injectable()
export class PartnersService extends BaseService<PartnerEntity> {
  constructor(
    @InjectRepository(PartnerEntity) repo: Repository<PartnerEntity>,
    @InjectRepository(ShareInvestmentEntity) private readonly shareRepo: Repository<ShareInvestmentEntity>,
    @InjectRepository(AdvanceLoanEntity) private readonly advRepo: Repository<AdvanceLoanEntity>,
    @InjectRepository(PartnerPayoutEntity) private readonly payoutRepo: Repository<PartnerPayoutEntity>,
    @InjectRepository(ProjectEntity) private readonly projectRepo: Repository<ProjectEntity>
  ) { super(repo) }

  findAll(): Promise<PartnerEntity[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } })
  }

  async getStats() {
    const partners = await this.findAll()
    const totalCount = partners.length
    const totalInvestedCapital = partners.reduce((s, p) => s + (Number(p.totalInvestedCapital) || 0), 0)
    const totalOutstandingLoans = partners.reduce((s, p) => s + (Number(p.outstandingLoans) || 0), 0)
    const totalActiveShares = partners.reduce((s, p) => s + (Number(p.activeSharesCount) || 0), 0)

    return { totalCount, totalInvestedCapital, totalOutstandingLoans, totalActiveShares }
  }

  async getStatement(id: string) {
    const partner = await this.findOne(id)
    if (!partner) throw new NotFoundException('الشريك غير موجود')
    return buildPartnerStatement(partner, this.shareRepo, this.advRepo, this.payoutRepo, this.projectRepo)
  }

  create(dto: Partial<PartnerEntity>): Promise<PartnerEntity> {
    const p = this.repository.create({
      ...dto,
      joinedDate: dto.joinedDate || new Date().toISOString().split('T')[0],
      activeSharesCount: 0,
      totalInvestedCapital: 0,
      outstandingLoans: 0
    })
    return this.repository.save(p)
  }

  async update(id: string, dto: Partial<PartnerEntity>): Promise<PartnerEntity> {
    const partner = await this.findOne(id)
    Object.assign(partner, dto)
    return this.repository.save(partner)
  }
}
