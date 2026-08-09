'use client';

import { LayoutDashboard, LogOut, Plus, Pyramid } from 'lucide-react';
import { Button } from './Button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { User } from '@/types/task';

type SidebarProps = {
  user: User | null;
  onCreate: () => void;
  onLogout: () => void;
};

export function Sidebar({ user, onCreate, onLogout }: SidebarProps) {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-line bg-panel p-5 lg:flex lg:flex-col">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-panel">
          <Pyramid size={20} />
        </div>
        <div>
          <p className="text-sm font-bold">Pyramid</p>
          <p className="text-xs text-muted">Assessment Task</p>
        </div>
      </div>

      <nav className="mt-10 grid gap-2">
        <button className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-sm font-semibold text-ink">
          <LayoutDashboard size={18} />
          Dashboard
        </button>
      </nav>

      <Button className="mt-8" onClick={onCreate}>
        <Plus size={17} />
        New task
      </Button>

      <div className="mt-auto grid gap-4">
        <ThemeSwitcher />
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm font-semibold text-ink">{user?.name ?? 'User'}</p>
          <p className="mt-1 text-xs text-muted">{user?.isGuest ? 'Guest session' : user?.email}</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

