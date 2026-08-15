'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { User } from '@/types/task';

type ProfileModalProps = {
  open: boolean;
  user: User | null;
  busy: boolean;
  onClose: () => void;
  onSave: (input: { name: string; email: string }) => Promise<void>;
};

export function ProfileModal({ open, user, busy, onClose, onSave }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form
        className="w-full max-w-lg rounded-2xl border border-line bg-panel p-5 shadow-soft"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ name, email });
        }}
      >
        <h2 className="text-lg font-bold text-ink">Edit profile</h2>
        <div className="mt-5 grid gap-4">
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button disabled={busy} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled={busy} type="submit">
            {busy ? 'Saving...' : 'Save profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
