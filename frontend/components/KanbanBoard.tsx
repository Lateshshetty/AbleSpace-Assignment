'use client';

import { MoreHorizontal, Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';

const columns: Array<{ status: TaskStatus; title: string }> = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'Doing' },
  { status: 'done', title: 'Completed' },
  { status: 'on-hold', title: 'On Hold' },
];

type KanbanBoardProps = {
  tasks: Task[];
  onCreate: (status?: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function KanbanBoard({ tasks, onCreate, onEdit, onDelete }: KanbanBoardProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-3 pr-6">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.status);
          return (
            <section key={column.status} className="w-[164px] shrink-0 animate-fade-up rounded-md bg-[#f3f3f3]/90 p-2 shadow-sm ring-1 ring-black/5 transition hover:shadow-lift sm:w-[260px]">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted">#</span>
                  <h2 className="text-[11px] font-bold text-ink">{column.title}</h2>
                  <span className="rounded bg-panel px-1.5 py-0.5 text-[9px] font-semibold text-muted">{columnTasks.length}</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <button aria-label={`Add task to ${column.title}`} className="grid h-5 w-5 place-items-center rounded hover:bg-panel" onClick={() => onCreate(column.status)}>
                    <Plus size={11} />
                  </button>
                  <button aria-label={`${column.title} options`} className="grid h-5 w-5 place-items-center rounded hover:bg-panel">
                    <MoreHorizontal size={11} />
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                {columnTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
                ))}
                <button className="rounded-md px-2 py-1.5 text-left text-[11px] font-medium text-ink hover:bg-panel" onClick={() => onCreate(column.status)}>
                  + Add Task
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
