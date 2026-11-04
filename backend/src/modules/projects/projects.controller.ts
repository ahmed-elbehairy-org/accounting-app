import { Controller, Get, Post, Delete, Patch, Param, Body } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectEntity } from '../../entities/project.entity'

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  findAll() {
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

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.service.getStats(id)
  }

  @Get(':id/investments')
  getInvestments(@Param('id') id: string) {
    return this.service.getInvestments(id)
  }

  @Post()
  create(@Body() body: Partial<ProjectEntity>) {
    return this.service.create(body)
  }

  @Post(':id/allocate')
  allocate(@Param('id') id: string, @Body() body: { partnerId: string; shareCount: number; date?: string }) {
    return this.service.allocateShares(id, body)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<ProjectEntity>) {
    return this.service.update(id, body)
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
