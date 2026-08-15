import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from '../projects/project.schema';
import { UsersService } from '../users/users.service';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: string) {
    const projectIds = await this.getMemberProjectIds(userId);
    return this.taskModel
      .find({
        $or: [
          { userId },
          ...(projectIds.length ? [{ projectId: { $in: projectIds } }] : []),
        ],
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.taskModel.findById(taskId).lean();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.assertTaskAccess(userId, task);
    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    const project = dto.projectId ? await this.assertProjectMember(userId, dto.projectId) : null;
    const user = await this.usersService.findById(userId);
    return this.taskModel.create({
      ...dto,
      project: project?.name || dto.project,
      projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : undefined,
      assignee: dto.assignee || user?.name || 'User',
      userId: new Types.ObjectId(userId),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const existing = await this.taskModel.findById(taskId).lean();
    if (!existing) {
      throw new NotFoundException('Task not found');
    }
    await this.assertTaskAccess(userId, existing);
    const project = dto.projectId ? await this.assertProjectMember(userId, dto.projectId) : null;

    const task = await this.taskModel
      .findOneAndUpdate(
        { _id: taskId },
        {
          ...dto,
          project: project?.name || dto.project,
          projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : existing.projectId,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        },
        { new: true, runValidators: true },
      )
      .lean();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(userId: string, taskId: string) {
    const task = await this.taskModel.findById(taskId).lean();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.assertTaskAccess(userId, task);
    await this.taskModel.findByIdAndDelete(taskId).lean();
    return { ok: true };
  }

  private async getMemberProjectIds(userId: string) {
    const projects = await this.projectModel
      .find({
        $or: [{ ownerId: userId }, { 'members.userId': new Types.ObjectId(userId) }],
      })
      .select('_id')
      .lean();
    return projects.map((project) => project._id);
  }

  private async assertProjectMember(userId: string, projectId: string) {
    const project = await this.projectModel
      .findOne({
        _id: projectId,
        $or: [{ ownerId: userId }, { 'members.userId': new Types.ObjectId(userId) }],
      })
      .lean();

    if (!project) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return project;
  }

  private async assertTaskAccess(userId: string, task: { userId: unknown; projectId?: unknown }) {
    if (task.userId?.toString() === userId) return;
    if (task.projectId) {
      await this.assertProjectMember(userId, task.projectId.toString());
      return;
    }
    throw new NotFoundException('Task not found');
  }
}
