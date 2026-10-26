import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { ProjectsService } from './projects.service'

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() body: { name: string; code?: string; description?: string }) {
    return this.service.create(body)
  }
}
