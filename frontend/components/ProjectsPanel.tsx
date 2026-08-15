'use client';

import { LogOut, MoreHorizontal, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from './Button';
import { Project, User } from '@/types/task';

type ProjectsPanelProps = {
  projects: Project[];
  searchQuery: string;
  user: User | null;
  onCreate: () => void;
  onInvite: () => void;
  onLeave: (project: Project) => void;
  onDelete: (project: Project) => void;
  onSearchChange: (query: string) => void;
};

export function ProjectsPanel({ projects, searchQuery, user, onCreate, onInvite, onLeave, onDelete, onSearchChange }: ProjectsPanelProps) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[13px] font-bold text-ink">Projects</h2>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="flex h-8 min-w-[220px] items-center gap-2 rounded-md border border-line bg-panel px-2 text-[11px] text-muted transition focus-within:border-ink/40 focus-within:shadow-sm">
            <Search size={13} />
            <input
              id="workspace-search"
              className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-muted"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search projects or members"
              type="search"
              value={searchQuery}
            />
            {searchQuery ? (
              <button aria-label="Clear project search" className="text-muted hover:text-ink" onClick={() => onSearchChange('')} type="button">
                <X size={13} />
              </button>
            ) : null}
          </label>
          <Button onClick={onCreate}><Plus size={13} /> Add Project</Button>
        </div>
      </div>
      <div className="animate-fade-up overflow-hidden rounded-md border border-line bg-panel shadow-sm transition hover:shadow-lift">
        <div className="grid grid-cols-[minmax(220px,1fr)_120px_120px_140px_120px] bg-[#f4f4f4] px-3 py-3 text-[12px] font-semibold">
          <span>Projects</span>
          <span>Priority</span>
          <span>Lead</span>
          <span>Due Date</span>
          <span className="text-right">Actions</span>
        </div>
        {projects.map((project, index) => (
          <div className="grid grid-cols-[minmax(220px,1fr)_120px_120px_140px_120px] items-center border-t border-line px-3 py-3 text-[12px]" key={project._id}>
            <div>
              <p className="font-medium text-ink">{project.name}</p>
              <p className="mt-1 text-[11px] text-muted">{project.description || 'Project workspace'}</p>
            </div>
            <span className={index === 0 ? 'text-red-500' : index === 1 ? 'text-muted' : 'text-orange-500'}>{index === 0 ? 'High' : index === 1 ? 'Low' : 'Medium'}</span>
            <span className="flex -space-x-1">
              {project.members.slice(0, 2).map((member) => (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-surface text-[9px] font-bold" key={`${project._id}-${member.userId}`}>
                  {member.name.slice(0, 1).toUpperCase()}
                </span>
              ))}
            </span>
            <span>12 Sep 2026</span>
            <span className="flex justify-end gap-2">
              {project.ownerId === user?.id ? (
                <>
                  <button className="text-[11px] font-semibold text-ink hover:underline" onClick={onInvite} type="button">Invite</button>
                  <button aria-label="Delete project" className="text-red-500" onClick={() => onDelete(project)} type="button"><Trash2 size={14} /></button>
                </>
              ) : (
                <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-ink" onClick={() => onLeave(project)} type="button">
                  <LogOut size={12} />
                  Leave
                </button>
              )}
              <MoreHorizontal size={14} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
