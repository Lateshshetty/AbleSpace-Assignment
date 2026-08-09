import { IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '../task.schema';

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

