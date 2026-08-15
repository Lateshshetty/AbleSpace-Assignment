'use client';

import { Loader2, Pyramid } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/State';
import { getToken } from '@/services/api';
import { getMe, googleLogin, logout } from '@/services/authService';
import { acceptProjectInvite } from '@/services/projectService';

function InviteAcceptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (token && getToken()) {
      continueAfterAuth();
    }
  }, [token]);

  async function continueAfterAuth() {
    try {
      const user = await getMe();
      if (user.isGuest) {
        localStorage.setItem('ablespace_pending_invite', token);
        logout();
        googleLogin();
        return;
      }
      await acceptInvite();
    } catch {
      localStorage.setItem('ablespace_pending_invite', token);
      logout();
      googleLogin();
    }
  }

  async function acceptInvite() {
    try {
      setBusy(true);
      setError('');
      if (!getToken()) {
        localStorage.setItem('ablespace_pending_invite', token);
        logout();
        googleLogin();
        return;
      }
      const user = await getMe();
      if (user.isGuest) {
        localStorage.setItem('ablespace_pending_invite', token);
        logout();
        googleLogin();
        return;
      }
      await acceptProjectInvite(token);
      setMessage('Invite accepted. You have been added to the project.');
      setTimeout(() => router.replace('/'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to accept invite');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface p-4">
      <section className="w-full max-w-md rounded-2xl border border-line bg-panel p-6 text-center shadow-soft">
        <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-xl bg-ink text-panel">
          <Pyramid size={21} />
        </div>
        <h1 className="text-xl font-bold text-ink">Accept project invite</h1>
        <p className="mt-2 text-sm text-muted">Join the project workspace and appear in the Projects section.</p>
        {message ? <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <div className="mt-4"><ErrorState message={error} /></div> : null}
        <Button className="mt-5 w-full" disabled={busy || !token} onClick={acceptInvite}>
          {busy ? <Loader2 className="animate-spin" size={16} /> : null}
          Accept invite
        </Button>
      </section>
    </main>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-surface text-sm font-semibold text-muted">Loading invite...</main>}>
      <InviteAcceptContent />
    </Suspense>
  );
}
