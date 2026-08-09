'use client';

import { Chrome, Loader2, Plus, Pyramid } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { EmptyState, ErrorState, LoadingState } from '@/components/State';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TaskList } from '@/components/TaskList';
import { TaskModal } from '@/components/TaskModal';
import { getToken } from '@/services/api';
import { getMe, googleLogin, guestLogin, logout as authLogout } from '@/services/authService';
import { createTask, deleteTask, getTasks, updateTask } from '@/services/taskService';
import { Task, TaskInput, User } from '@/types/task';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      active: tasks.filter((task) => task.status !== 'done').length,
      done: tasks.filter((task) => task.status === 'done').length,
    }),
    [tasks],
  );

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    loadApp();
  }, []);

  async function loadApp() {
    try {
      setLoading(true);
      setError('');
      const [me, items] = await Promise.all([getMe(), getTasks()]);
      setUser(me);
      setTasks(items);
    } catch (err) {
      authLogout();
      setUser(null);
      setError(err instanceof Error ? err.message : 'Unable to load your session');
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    try {
      setAuthBusy(true);
      setError('');
      await guestLogin();
      await loadApp();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Guest login failed');
    } finally {
      setAuthBusy(false);
    }
  }

  function handleLogout() {
    authLogout();
    setUser(null);
    setTasks([]);
  }

  function openCreate() {
    setEditingTask(null);
    setModalOpen(true);
  }

  async function handleSave(input: TaskInput) {
    try {
      setSaving(true);
      setError('');
      if (editingTask) {
        const updated = await updateTask(editingTask._id, input);
        setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
      } else {
        const created = await createTask(input);
        setTasks((current) => [created, ...current]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save task');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(task: Task) {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;
    try {
      setError('');
      await deleteTask(task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete task');
    }
  }

  if (!user && !loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-4 py-10">
        <section className="w-full max-w-md text-center">
          <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-ink text-panel">
            <Pyramid size={21} />
          </div>
          <p className="mb-4 text-sm font-bold text-ink">Pyramid</p>
          <div className="rounded-[22px] border border-line bg-panel p-6 shadow-soft">
            <h1 className="border border-zinc-400 px-4 py-1 text-xl font-bold text-ink">Let's get back on track</h1>
            <p className="mt-2 border border-yellow-300 px-3 py-1 text-sm text-muted">Enter your email below to login to your account.</p>
            <div className="mt-6 grid gap-3">
              <Button disabled={authBusy} onClick={handleGuestLogin}>
                {authBusy ? <Loader2 className="animate-spin" size={16} /> : null}
                Continue as Guest
              </Button>
              <Button onClick={googleLogin} variant="secondary">
                <Chrome size={17} />
                Login with Google
              </Button>
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-xs text-xs leading-5 text-muted">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
          {error ? <div className="mt-5"><ErrorState message={error} /></div> : null}
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink lg:flex">
      <Sidebar user={user} onCreate={openCreate} onLogout={handleLogout} />
      <main className="min-w-0 flex-1">
        <Header user={user} onCreate={openCreate} onLogout={handleLogout} />
        <div className="px-4 py-6 lg:px-8">
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Total tasks" value={stats.total} />
            <Stat label="Active" value={stats.active} />
            <Stat label="Done" value={stats.done} />
          </div>
          {error ? <div className="mb-5"><ErrorState message={error} /></div> : null}
          {loading ? <LoadingState label="Loading your workspace" /> : tasks.length ? (
            <TaskList
              tasks={tasks}
              onEdit={(task) => {
                setEditingTask(task);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ) : (
            <EmptyState onCreate={openCreate} />
          )}
        </div>
        <button
          aria-label="Add task"
          className="fixed bottom-5 right-5 grid h-14 w-14 place-items-center rounded-full bg-ink text-panel shadow-soft sm:hidden"
          onClick={openCreate}
        >
          <Plus size={22} />
        </button>
      </main>
      <TaskModal busy={saving} onClose={() => setModalOpen(false)} onSubmit={handleSave} open={modalOpen} task={editingTask} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

