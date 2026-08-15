'use client';

import { ArrowLeft, Calendar, Link, Lock, MoreHorizontal, Send, Share2, Tag, Users } from 'lucide-react';
import { PriorityBadge } from './Badges';
import { Task } from '@/types/task';
import { formatDueDate } from '@/utils/date';

type TaskDetailViewProps = {
  task: Task;
  onBack: () => void;
  onEdit: (task: Task) => void;
};

export function TaskDetailView({ task, onBack, onEdit }: TaskDetailViewProps) {
  return (
    <div className="grid animate-fade-up gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        <button className="mb-5 flex items-center gap-2 text-[12px] font-semibold text-muted hover:text-ink" onClick={onBack} type="button">
          <ArrowLeft size={14} />
          Back to tasks
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">{task.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{task.description || 'Create clear and detailed notes for this task.'}</p>
          </div>
          <div className="flex gap-2">
            <Icon><Lock size={14} /></Icon>
            <Icon><Share2 size={14} /></Icon>
            <Icon><MoreHorizontal size={14} /></Icon>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-[12px]">
          <Property label="Properties">
            <span className="rounded bg-surface px-2 py-1">{(task.assignee || 'User').slice(0, 1).toUpperCase()}</span>
            <span className="font-semibold">{task.assignee || 'User'}</span>
            {task.dueDate ? <span className="rounded bg-red-50 px-2 py-1 text-red-500">{formatDueDate(task.dueDate)}</span> : null}
          </Property>
          <Property label="Labels">
            {[task.label || 'Research', task.project || 'Deployment', 'Testing'].map((label) => (
              <span className="inline-flex items-center gap-1 rounded bg-surface px-2 py-1" key={label}>
                <Tag size={11} />
                {label}
              </span>
            ))}
          </Property>
          <Property label="Resources">
            <span className="inline-flex items-center gap-1 text-muted"><Link size={12} /> Add document or link...</span>
          </Property>
        </div>

        <h2 className="mt-7 text-[13px] font-bold text-ink">Subtasks</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-panel shadow-sm">
          <div className="grid grid-cols-[1fr_100px_100px_120px_60px] bg-[#f4f4f4] px-3 py-2 text-[11px] font-semibold">
            <span>Task</span><span>Priority</span><span>Members</span><span>Due Date</span><span className="text-right">Actions</span>
          </div>
          {['Subtask 1', 'Subtask 2', 'Subtask 3'].map((name, index) => (
            <div className="grid grid-cols-[1fr_100px_100px_120px_60px] border-t border-line px-3 py-2 text-[12px]" key={name}>
              <span>{name}</span>
              <span><PriorityBadge priority={index === 1 ? 'low' : index === 2 ? 'medium' : 'high'} /></span>
              <span>{index === 1 ? 'CN' : '+'}</span>
              <span>12 Sep 2026</span>
              <span className="flex justify-end"><MoreHorizontal size={14} /></span>
            </div>
          ))}
          <button className="border-t border-line px-3 py-2 text-[12px] font-medium">+ Add Subtasks</button>
        </div>

        <h2 className="mt-6 text-[13px] font-bold text-ink">Comments</h2>
        <div className="mt-3 rounded-md border border-line bg-panel p-3 shadow-sm">
          <p className="text-[12px] font-semibold">{task.assignee || 'You'} <span className="font-normal text-muted">just now</span></p>
          <p className="mt-3 text-sm">{task.description || 'Add a task update here.'}</p>
          <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-muted">
            <span className="flex-1 text-[12px]">Leave a reply...</span>
            <Send size={14} />
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-4 shadow-sm transition hover:shadow-lift">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-bold">Details</h2>
            <button onClick={() => onEdit(task)} type="button">+</button>
          </div>
          <Detail label="Status" value={task.status} />
          <Detail label="Priority" value={<PriorityBadge priority={task.priority} />} />
          <Detail label="Members" value={<span className="inline-flex items-center gap-1"><Users size={12} /> {task.assignee || 'User'}</span>} />
          <Detail label="Dates" value={<span className="inline-flex items-center gap-1"><Calendar size={12} /> {formatDueDate(task.dueDate)}</span>} />
          <Detail label="Labels" value={task.label || 'Deployment'} />
        </div>
        <div className="rounded-md border border-line bg-panel p-4 shadow-sm transition hover:shadow-lift">
          <h2 className="text-[13px] font-bold">Updates</h2>
          <p className="mt-4 text-[12px] text-muted">You posted an update · Aug 2026</p>
        </div>
      </aside>
    </div>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return <button className="grid h-8 w-8 place-items-center rounded border border-line bg-panel" type="button">{children}</button>;
}

function Property({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid grid-cols-[90px_1fr] items-center gap-3"><span className="font-semibold text-muted">{label}</span><div className="flex flex-wrap gap-2">{children}</div></div>;
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="grid grid-cols-[80px_1fr] py-2 text-[12px]"><span className="text-muted">{label}</span><span>{value}</span></div>;
}
