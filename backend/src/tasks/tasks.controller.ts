import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from '../common/authenticated-request';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.tasksService.findAll(request.user.userId);
  }

  @Get(':id')
  findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.findOne(request.user.userId, id);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(request.user.userId, dto);
  }

  @Patch(':id')
  update(@Req() request: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(request.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.remove(request.user.userId, id);
  }
}

