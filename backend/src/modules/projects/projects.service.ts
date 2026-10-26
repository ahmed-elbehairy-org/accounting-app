import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectEntity } from '../../entities/project.entity'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>
  ) {}

  findAll(): Promise<ProjectEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string): Promise<ProjectEntity> {
    const project = await this.repo.findOne({ where: { id } })
    if (!project) throw new NotFoundException('Project not found')
    return project
  }

  create(dto: { name: string; code?: string; description?: string }): Promise<ProjectEntity> {
    const project = this.repo.create({
      id: `proj-${Date.now()}`,
      name: dto.name.trim(),
      code: (dto.code || `PRJ-${Date.now().toString().slice(-4)}`).trim().toUpperCase(),
      description: (dto.description || '').trim(),
      status: 'active'
    })
    return this.repo.save(project)
  }
}
