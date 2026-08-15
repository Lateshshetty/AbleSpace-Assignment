'use client';

import { Filter, LogOut, PanelLeft, Plus, Search, SlidersHorizontal, UserPlus } from 'lucide-react';
import { Button } from './Button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { User } from '@/types/task';

type HeaderProps = {
  user: User | null;
  teammates: string[];
  activeView: 'tasks' | 'projects' | 'profile';
  onCreate: () => void;
  onInvite: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
};

export function Header({ user, teammates, activeView, onCreate, onInvite, onEditProfile, onLogout }: HeaderProps) {
  const avatarNames = [user?.name || 'Dexter', ...teammates].slice(0, 4);

  return (
    <header className="glass-panel sticky top-0 z-10 border-b border-line">
      <div className="flex h-14 items-center justify-between gap-4 px-3 lg:px-4">
        <div className="flex items-center gap-3">
          <button aria-label="Toggle sidebar" className="grid h-7 w-7 place-items-center rounded-md text-ink hover:bg-surface" type="button">
            <PanelLeft size={14} />
          </button>
          <h1 className="text-[13px] font-bold text-ink">{activeView === 'tasks' ? 'Tasks' : activeView === 'projects' ? 'Projects' : 'Profile'}</h1>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          {avatarNames.map((name, index) => (
            <button
              className="-ml-2 grid h-9 w-9 place-items-center rounded-full border-2 border-panel bg-ink text-xs font-bold text-panel shadow-md transition hover:-translate-y-1 hover:scale-105 hover:shadow-lift first:ml-0"
              key={`${name}-${index}`}
              onClick={index === 0 ? onEditProfile : undefined}
              title={name}
              type="button"
            >
              {name.slice(0, 1).toUpperCase()}
            </button>
          ))}
          <button
            aria-label="Invite teammates"
            className="-ml-2 grid h-9 w-9 place-items-center rounded-full border-2 border-panel bg-purple-600 text-white shadow-md transition hover:-translate-y-1 hover:scale-105 hover:shadow-lift"
            onClick={onInvite}
            type="button"
          >
            <UserPlus size={15} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <IconButton label="Search"><Search size={16} /></IconButton>
          <IconButton label="Fields"><SlidersHorizontal size={16} /></IconButton>
          <IconButton label="Filter"><Filter size={16} /></IconButton>
          <ThemeSwitcher />
          <Button className="hidden !rounded-md !bg-ink !px-3 !text-[11px] sm:inline-flex" onClick={onCreate}>
            <Plus size={13} />
            Add task
          </Button>
          <button
            aria-label="Logout"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-panel text-ink lg:hidden"
            onClick={onLogout}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button aria-label={label} className="hidden h-8 w-8 place-items-center rounded-md border border-line bg-panel text-ink hover:bg-surface sm:grid" type="button">
      {children}
    </button>
  );
}
