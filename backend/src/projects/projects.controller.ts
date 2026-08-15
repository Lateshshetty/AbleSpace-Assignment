import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from '../common/authenticated-request';
import { CreateProjectDto } from './dto/create-project.dto';
import { InviteProjectDto } from './dto/invite-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.projectsService.findAll(request.user.userId);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(request.user.userId, dto);
  }

  @Post(':id/invites')
  invite(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: InviteProjectDto) {
    return this.projectsService.invite(request.user.userId, id, dto.email);
  }

  @Post('invites/accept')
  accept(@Req() request: AuthenticatedRequest, @Body() body: { token: string }) {
    return this.projectsService.accept(request.user.userId, body.token);
  }

  @Post(':id/leave')
  leave(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.projectsService.leave(request.user.userId, id);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.projectsService.remove(request.user.userId, id);
  }
}
