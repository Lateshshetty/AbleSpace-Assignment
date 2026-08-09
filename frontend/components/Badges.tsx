import { clsx } from 'clsx';
import { TaskPriority, TaskStatus } from '@/types/task';

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
};

const priorityLabel: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={clsx(
        'rounded-full px-3 py-1 text-xs font-semibold',
        status === 'todo' && 'bg-zinc-100 text-zinc-700',
        status === 'in-progress' && 'bg-blue-50 text-blue-700',
        status === 'done' && 'bg-emerald-50 text-emerald-700',
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={clsx(
        'rounded-full px-3 py-1 text-xs font-semibold',
        priority === 'low' && 'bg-slate-100 text-slate-700',
        priority === 'medium' && 'bg-amber-50 text-amber-700',
        priority === 'high' && 'bg-red-50 text-red-700',
      )}
    >
      {priorityLabel[priority]}
    </span>
  );
}

