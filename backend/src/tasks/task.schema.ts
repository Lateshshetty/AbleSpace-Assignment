import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done',
}

export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 120 })
  title: string;

  @Prop({ trim: true, maxlength: 1000, default: '' })
  description: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.Todo, index: true })
  status: TaskStatus;

  @Prop({ enum: TaskPriority, default: TaskPriority.Medium, index: true })
  priority: TaskPriority;

  @Prop()
  dueDate?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ userId: 1, createdAt: -1 });

