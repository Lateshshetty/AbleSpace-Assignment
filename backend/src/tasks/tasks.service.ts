import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  async findAll(userId: string) {
    return this.taskModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.taskModel.findOne({ _id: taskId, userId }).lean();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  create(userId: string, dto: CreateTaskDto) {
    return this.taskModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.taskModel
      .findOneAndUpdate(
        { _id: taskId, userId },
        {
          ...dto,
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
    const result = await this.taskModel.findOneAndDelete({ _id: taskId, userId }).lean();
    if (!result) {
      throw new NotFoundException('Task not found');
    }
    return { ok: true };
  }
}

