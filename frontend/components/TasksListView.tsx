'use client';

import { MoreHorizontal, Plus } from 'lucide-react';
import { PriorityBadge } from './Badges';
import { Task, TaskStatus } from '@/types/task';
import { formatDueDate } from '@/utils/date';

const groups: Array<{ status: TaskStatus; title: string }> = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'Doing' },
  { status: 'done', title: 'Completed' },
  { status: 'on-hold', title: 'On Hold' },
];

type TasksListViewProps = {
  tasks: Task[];
  onCreate: (status?: TaskStatus) => void;
  onOpen: (task: Task) => void;
};

export function TasksListView({ tasks, onCreate, onOpen }: TasksListViewProps) {
  return (
    <div className="grid gap-4">
      {groups.map((group) => {
        const groupTasks = tasks.filter((task) => task.status === group.status);
        return (
          <section className="animate-fade-up" key={group.status}>
            <button className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-ink" type="button">
              <span className="text-[10px]">▾</span>
              {group.title}
            </button>
            <div className="overflow-hidden rounded-md border border-line bg-panel shadow-sm transition hover:shadow-lift">
              <div className="grid grid-cols-[minmax(220px,1fr)_110px_110px_130px_70px] bg-[#f4f4f4] px-3 py-2 text-[11px] font-semibold text-ink">
                <span>Task</span>
                <span>Priority</span>
                <span>Members</span>
                <span>Due Date</span>
                <span className="text-right">Actions</span>
              </div>
              {groupTasks.map((task) => (
                <button
                  className="grid w-full grid-cols-[minmax(220px,1fr)_110px_110px_130px_70px] items-center border-t border-line px-3 py-2 text-left text-[12px] transition hover:bg-surface hover:shadow-[inset_3px_0_0_rgb(20_20_20)]"
                  key={task._id}
                  onClick={() => onOpen(task)}
                  type="button"
                >
                  <span className="truncate font-medium text-ink">{task.title}</span>
                  <span><PriorityBadge priority={task.priority} /></span>
                  <span className="flex items-center gap-1 text-[11px] text-ink">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-fuchsia-600 text-[9px] text-white">{(task.assignee || 'U').slice(0, 1).toUpperCase()}</span>
                    <span className="truncate">{task.assignee || 'User'}</span>
                  </span>
                  <span className="text-[11px] text-ink">{formatDueDate(task.dueDate)}</span>
                  <span className="flex justify-end"><MoreHorizontal size={14} /></span>
                </button>
              ))}
              <button className="flex w-full items-center gap-2 border-t border-line px-3 py-2 text-left text-[12px] font-medium text-ink hover:bg-surface" onClick={() => onCreate(group.status)} type="button">
                <Plus size={13} />
                Add Task
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
