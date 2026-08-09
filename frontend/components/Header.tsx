'use client';

import { LogOut, Menu, Plus, Pyramid } from 'lucide-react';
import { Button } from './Button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { User } from '@/types/task';

type HeaderProps = {
  user: User | null;
  onCreate: () => void;
  onLogout: () => void;
};

export function Header({ user, onCreate, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface/95 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-panel lg:hidden">
            <Pyramid size={19} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted">Welcome back</p>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">{user?.name ?? 'Dashboard'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button className="hidden sm:inline-flex" onClick={onCreate}>
            <Plus size={17} />
            Add task
          </Button>
          <button
            aria-label="Logout"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel text-ink lg:hidden"
            onClick={onLogout}
          >
            <LogOut size={17} />
          </button>
          <button aria-label="Open menu" className="hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-panel text-ink">
            <Menu size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

