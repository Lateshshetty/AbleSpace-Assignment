'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { saveAuthToken } from '@/services/authService';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      saveAuthToken(token);
      router.replace('/');
    } else {
      router.replace('/?authError=google');
    }
  }, [router, searchParams]);

  return <main className="grid min-h-screen place-items-center bg-surface text-sm font-semibold text-muted">Signing you in...</main>;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-surface text-sm font-semibold text-muted">Signing you in...</main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
