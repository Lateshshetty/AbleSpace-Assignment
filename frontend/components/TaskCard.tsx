'use client';

import { Calendar, MoreHorizontal, Pencil, Tag, Trash2 } from 'lucide-react';
import { PriorityBadge } from './Badges';
import { Task } from '@/types/task';
import { formatDueDate } from '@/utils/date';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const assignee = task.assignee || 'Admin';
  const initials = assignee
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group animate-fade-up rounded-md border border-[#e7e7e7] bg-panel p-2.5 shadow-[0_1px_1px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-lift">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[11px] font-bold text-ink transition group-hover:text-black">{task.title}</h3>
          {task.description ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{task.description}</p> : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <button aria-label="Edit task" className="grid h-5 w-5 place-items-center rounded hover:bg-surface" onClick={() => onEdit(task)}>
            <Pencil size={11} />
          </button>
          <button aria-label="Delete task" className="grid h-5 w-5 place-items-center rounded text-red-500 hover:bg-red-50" onClick={() => onDelete(task)}>
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex min-w-0 items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium text-ink">
          <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-fuchsia-600 text-[8px] text-white">{initials}</span>
          <span className="truncate">{assignee}</span>
        </span>
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500">
            <Calendar size={10} />
            {formatDueDate(task.dueDate)}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="inline-flex max-w-full items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-ink">
          <Tag size={10} className="shrink-0" />
          <span className="truncate">{task.project || 'Deployment'}</span>
        </span>
        <span className="inline-flex max-w-full items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-ink">
          <MoreHorizontal size={10} className="shrink-0" />
          <span className="truncate">{task.label || 'Deployment'}</span>
        </span>
        <PriorityBadge priority={task.priority} />
      </div>
    </article>
  );
}
