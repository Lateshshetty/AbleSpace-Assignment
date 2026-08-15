'use client';

import { Mail, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Project, ProjectInvite } from '@/types/task';

type InviteModalProps = {
  open: boolean;
  projects: Project[];
  busy: boolean;
  invite: ProjectInvite | null;
  onClose: () => void;
  onInvite: (projectId: string, email: string) => Promise<void>;
};

export function InviteModal({ open, projects, busy, invite, onClose, onInvite }: InviteModalProps) {
  const [projectId, setProjectId] = useState('');
  const [email, setEmail] = useState('');
  const selectedProjectId = projectId || projects[0]?._id || '';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form
        className="w-full max-w-lg rounded-2xl border border-line bg-panel p-5 shadow-soft"
        onSubmit={(event) => {
          event.preventDefault();
          if (selectedProjectId && email) onInvite(selectedProjectId, email);
        }}
      >
        <h2 className="text-lg font-bold text-ink">Invite teammate</h2>
        <p className="mt-1 text-sm text-muted">Create an acceptance link for a project teammate.</p>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-ink">
            <span>Project</span>
            <select className="min-h-11 rounded-xl border border-line bg-panel px-4 text-sm text-ink" value={selectedProjectId} onChange={(event) => setProjectId(event.target.value)}>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <Input label="Teammate email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        {invite ? (
          <div className="mt-5 rounded-xl border border-line bg-surface p-3">
            <p className="text-xs font-bold text-ink">Invite link created</p>
            <p className="mt-2 break-all text-xs text-muted">{invite.acceptUrl}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => navigator.clipboard.writeText(invite.acceptUrl)} type="button" variant="secondary">
                <Copy size={15} />
                Copy link
              </Button>
              <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-panel" href={invite.mailtoHref}>
                <Mail size={15} />
                Open email
              </a>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button disabled={busy} onClick={onClose} type="button" variant="secondary">
            Close
          </Button>
          <Button disabled={busy || !projects.length} type="submit">
            {busy ? 'Creating...' : 'Create invite'}
          </Button>
        </div>
      </form>
    </div>
  );
}

