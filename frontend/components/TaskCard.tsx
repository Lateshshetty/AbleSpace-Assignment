'use client';

import { Calendar, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge, TaskStatusBadge } from './Badges';
import { Task } from '@/types/task';
import { formatDueDate } from '@/utils/date';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="rounded-2xl border border-line bg-panel p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">{task.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{task.description || 'No description added.'}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button aria-label="Edit task" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" onClick={() => onEdit(task)}>
            <Pencil size={16} />
          </button>
          <button aria-label="Delete task" className="grid h-9 w-9 place-items-center rounded-full text-red-600 hover:bg-red-50" onClick={() => onDelete(task)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <TaskStatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted">
        <Calendar size={15} />
        {formatDueDate(task.dueDate)}
      </div>
    </article>
  );
}

