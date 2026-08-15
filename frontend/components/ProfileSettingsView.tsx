'use client';

import { ArrowLeft, Palette, Search, Settings, UserRound } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { User } from '@/types/task';
import { useState } from 'react';

type ProfileSettingsViewProps = {
  user: User | null;
  busy: boolean;
  onBack: () => void;
  onSave: (input: { name: string; email: string }) => Promise<void>;
  onLeaveWorkspace: () => void;
};

export function ProfileSettingsView({ user, busy, onBack, onSave, onLeaveWorkspace }: ProfileSettingsViewProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <div className="grid min-h-[calc(100vh-56px)] animate-fade-up grid-cols-[210px_1fr] bg-panel">
      <aside className="glass-panel border-r border-line p-4">
        <button className="mb-5 flex items-center gap-2 text-[12px] font-medium text-ink" onClick={onBack} type="button">
          <ArrowLeft size={13} />
          Back to app
        </button>
        <label className="mb-2 flex h-8 items-center gap-2 rounded border border-line px-2 text-[12px] text-muted">
          <Search size={13} />
          <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Search" />
        </label>
        <nav className="grid gap-1 text-[12px]">
          <button className="flex items-center gap-2 rounded bg-surface px-2 py-2 font-semibold" type="button"><UserRound size={14} /> Profile</button>
          <button className="flex items-center gap-2 rounded px-2 py-2 text-muted hover:bg-surface" type="button"><Settings size={14} /> Theme</button>
          <button className="flex items-center gap-2 rounded px-2 py-2 text-muted hover:bg-surface" type="button"><Palette size={14} /> Color</button>
        </nav>
      </aside>
      <main className="px-16 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex items-center gap-6">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-fuchsia-600 text-sm font-bold text-white shadow-lg">{(user?.name || 'D').slice(0, 1).toUpperCase()}</div>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <form
            className="rounded-md border border-line bg-panel shadow-sm transition hover:shadow-lift"
            onSubmit={(event) => {
              event.preventDefault();
              onSave({ name, email });
            }}
          >
            <div className="grid grid-cols-[1fr_180px] items-center border-b border-line px-6 py-4 text-[12px]">
              <span>Profile picture</span>
              <span className="justify-self-end grid h-8 w-8 place-items-center rounded-full bg-fuchsia-600 text-white">{(user?.name || 'D').slice(0, 1).toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-[1fr_220px] items-center border-b border-line px-6 py-4 text-[12px]">
              <span>Email</span>
              <Input aria-label="Email" label="" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="grid grid-cols-[1fr_220px] items-center border-b border-line px-6 py-4 text-[12px]">
              <span>Full name</span>
              <Input aria-label="Full name" label="" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="grid grid-cols-[1fr_220px] items-center border-b border-line px-6 py-4 text-[12px]">
              <span>Title<br /><span className="text-[11px] text-muted">Your job title or role</span></span>
              <input className="h-9 rounded bg-surface px-3 text-[12px] outline-none" placeholder="Designer" />
            </div>
            <div className="flex justify-end px-6 py-4">
              <Button disabled={busy} type="submit">{busy ? 'Saving...' : 'Save profile'}</Button>
            </div>
          </form>
          <h2 className="mt-10 text-base font-semibold">Workspace access</h2>
          <div className="mt-5 flex items-center justify-between rounded-md border border-line p-5 text-[12px] shadow-sm transition hover:shadow-lift">
            <span className="text-muted">Remove yourself from the workspace</span>
            <button className="rounded-md bg-red-50 px-4 py-2 font-semibold text-red-500" onClick={onLeaveWorkspace} type="button">Leave Workspace</button>
          </div>
        </div>
      </main>
    </div>
  );
}
