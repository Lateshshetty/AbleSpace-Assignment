'use client';

import { Briefcase, CheckSquare, ChevronDown, LogOut, Plus } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { User } from '@/types/task';

type SidebarProps = {
  user: User | null;
  activeView: 'tasks' | 'projects' | 'profile';
  onCreate: () => void;
  onViewChange: (view: 'tasks' | 'projects' | 'profile') => void;
  onEditProfile: () => void;
  onLogout: () => void;
};

export function Sidebar({ user, activeView, onCreate, onViewChange, onEditProfile, onLogout }: SidebarProps) {
  return (
    <aside className="glass-panel hidden min-h-screen w-[150px] shrink-0 animate-slide-in border-r border-line px-3 py-6 lg:flex lg:flex-col">
      <button className="flex items-center justify-between gap-2 rounded-md px-1 py-1 text-left transition hover:bg-surface hover:shadow-sm" onClick={onEditProfile} type="button">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-fuchsia-600 text-[9px] font-bold text-white">
            {(user?.name || 'D').slice(0, 1).toUpperCase()}
          </div>
          <p className="truncate text-[11px] font-semibold text-ink">{user?.name || 'Dexter'}</p>
        </div>
        <ChevronDown size={12} className="shrink-0 text-muted" />
      </button>

      <div className="mt-7 flex items-center justify-between px-1">
        <p className="text-[11px] font-semibold text-ink">Workspace</p>
        <ChevronDown size={12} className="text-muted" />
      </div>

      <nav className="mt-2 grid gap-1">
        <button
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium transition ${activeView === 'tasks' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:bg-surface hover:text-ink hover:shadow-sm'}`}
          onClick={() => onViewChange('tasks')}
          type="button"
        >
          <CheckSquare size={13} />
          Tasks
        </button>
        <button
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium transition ${activeView === 'projects' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:bg-surface hover:text-ink hover:shadow-sm'}`}
          onClick={() => onViewChange('projects')}
          type="button"
        >
          <Briefcase size={13} />
          Projects
        </button>
      </nav>

      <button className="mt-5 flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] font-medium text-muted transition hover:bg-surface hover:text-ink hover:shadow-sm" onClick={onCreate} type="button">
        <Plus size={13} />
        Add task
      </button>

      <div className="mt-auto grid gap-3">
        <ThemeSwitcher />
        <button className={`flex items-center gap-2 px-2 text-[11px] font-medium ${activeView === 'profile' ? 'text-ink' : 'text-muted hover:text-ink'}`} onClick={() => onViewChange('profile')} type="button">
          Profile
        </button>
        <button className="flex items-center gap-2 px-2 text-[11px] font-medium text-muted hover:text-ink" onClick={onLogout}>
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </aside>
  );
}
