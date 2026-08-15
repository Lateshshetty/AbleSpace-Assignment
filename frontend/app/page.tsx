'use client';

import { Chrome, Loader2, Plus, Pyramid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { ErrorState, LoadingState } from '@/components/State';
import { Header } from '@/components/Header';
import { InviteModal } from '@/components/InviteModal';
import { KanbanBoard } from '@/components/KanbanBoard';
import { ProfileSettingsView } from '@/components/ProfileSettingsView';
import { ProjectsPanel } from '@/components/ProjectsPanel';
import { Sidebar } from '@/components/Sidebar';
import { TaskDetailView } from '@/components/TaskDetailView';
import { TasksListView } from '@/components/TasksListView';
import { TaskModal } from '@/components/TaskModal';
import { getToken } from '@/services/api';
import { getMe, googleLogin, guestLogin, logout as authLogout, updateProfile } from '@/services/authService';
import { createProject, deleteProject, getProjects, inviteToProject, leaveProject } from '@/services/projectService';
import { createTask, deleteTask, getTasks, updateTask } from '@/services/taskService';
import { Project, ProjectInvite, Task, TaskInput, TaskStatus, User } from '@/types/task';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>('todo');
  const [activeView, setActiveView] = useState<'tasks' | 'projects' | 'profile'>('tasks');
  const [taskDisplay, setTaskDisplay] = useState<'list' | 'board'>('list');
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [lastInvite, setLastInvite] = useState<ProjectInvite | null>(null);

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
      const [me, items, projectItems] = await Promise.all([getMe(), getTasks(), getProjects()]);
      setUser(me);
      setTasks(items);
      if (projectItems.length) {
        setProjects(projectItems);
      } else {
        const project = await createProject({ name: 'Deployment', description: 'Default project workspace' });
        setProjects([project]);
      }
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
    setProjects([]);
  }

  function openCreate(status: TaskStatus = 'todo') {
    setEditingTask(null);
    setInitialStatus(status);
    setModalOpen(true);
  }

  async function handleInvite(projectId: string, email: string) {
    try {
      setSaving(true);
      setError('');
      const invite = await inviteToProject(projectId, email);
      setLastInvite(invite);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create invite');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateProject() {
    const name = window.prompt('Project name');
    if (!name) return;
    try {
      setSaving(true);
      const project = await createProject({ name, description: 'Project workspace' });
      setProjects((current) => [project, ...current]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create project');
    } finally {
      setSaving(false);
    }
  }

  async function handleProfileSave(input: { name: string; email: string }) {
    try {
      setSaving(true);
      setError('');
      const updated = await updateProfile(input);
      setUser(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleLeaveProject(project: Project) {
    const confirmed = window.confirm(`Leave "${project.name}"? You will no longer see its shared tasks.`);
    if (!confirmed) return;
    try {
      setSaving(true);
      setError('');
      await leaveProject(project._id);
      setProjects((current) => current.filter((item) => item._id !== project._id));
      setTasks((current) => current.filter((task) => task.projectId !== project._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to leave project');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProject(project: Project) {
    const confirmed = window.confirm(`Delete "${project.name}"? Project invites will be removed. Existing task records are not deleted.`);
    if (!confirmed) return;
    try {
      setSaving(true);
      setError('');
      await deleteProject(project._id);
      setProjects((current) => current.filter((item) => item._id !== project._id));
      setTasks((current) => current.filter((task) => task.projectId !== project._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete project');
    } finally {
      setSaving(false);
    }
  }

  async function handleSave(input: TaskInput) {
    try {
      setSaving(true);
      setError('');
      if (editingTask) {
        const updated = await updateTask(editingTask._id, input);
        setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
        setSelectedTask((current) => (current?._id === updated._id ? updated : current));
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
      <Sidebar
        activeView={activeView}
        user={user}
        onCreate={() => openCreate()}
        onEditProfile={() => setActiveView('profile')}
        onLogout={handleLogout}
        onViewChange={setActiveView}
      />
      <main className="min-w-0 flex-1">
        <Header
          activeView={activeView}
          user={user}
          teammates={projects.flatMap((project) => project.members.map((member) => member.name)).filter((name) => name !== user?.name)}
          onCreate={() => openCreate()}
          onEditProfile={() => setActiveView('profile')}
          onInvite={() => {
            setLastInvite(null);
            setInviteOpen(true);
          }}
          onLogout={handleLogout}
        />
        <div className="px-3 py-4 lg:px-4">
          {activeView !== 'profile' ? <ProjectStrip projects={projects} tasks={tasks} /> : null}
          {error ? <div className="mb-5"><ErrorState message={error} /></div> : null}
          {loading ? <LoadingState label="Loading your workspace" /> : activeView === 'profile' ? (
            <ProfileSettingsView busy={saving} onBack={() => setActiveView('tasks')} onLeaveWorkspace={handleLogout} onSave={handleProfileSave} user={user} />
          ) : selectedTask ? (
            <TaskDetailView
              task={selectedTask}
              onBack={() => setSelectedTask(null)}
              onEdit={(task) => {
                setEditingTask(task);
                setInitialStatus(task.status);
                setModalOpen(true);
              }}
            />
          ) : activeView === 'tasks' ? (
            <>
              <TasksToolbar
                display={taskDisplay}
                fieldsOpen={fieldsOpen}
                onCreate={() => openCreate()}
                onFieldsToggle={() => setFieldsOpen((open) => !open)}
                onDisplayChange={setTaskDisplay}
              />
              {taskDisplay === 'list' ? (
                <TasksListView tasks={tasks} onCreate={openCreate} onOpen={setSelectedTask} />
              ) : (
                <KanbanBoard
                  tasks={tasks}
                  onCreate={openCreate}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setInitialStatus(task.status);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              )}
            </>
          ) : (
            <ProjectsPanel
              projects={projects}
              user={user}
              onCreate={handleCreateProject}
              onDelete={handleDeleteProject}
              onInvite={() => setInviteOpen(true)}
              onLeave={handleLeaveProject}
            />
          )}
        </div>
        <button
          aria-label="Add task"
          className="fixed bottom-5 right-5 grid h-14 w-14 place-items-center rounded-full bg-ink text-panel shadow-soft sm:hidden"
          onClick={() => openCreate()}
        >
          <Plus size={22} />
        </button>
      </main>
      <TaskModal busy={saving} currentUser={user} initialStatus={initialStatus} onClose={() => setModalOpen(false)} onSubmit={handleSave} open={modalOpen} projects={projects} task={editingTask} />
      <InviteModal busy={saving} invite={lastInvite} onClose={() => setInviteOpen(false)} onInvite={handleInvite} open={inviteOpen} projects={projects} />
    </div>
  );
}

function TasksToolbar({
  display,
  fieldsOpen,
  onCreate,
  onFieldsToggle,
  onDisplayChange,
}: {
  display: 'list' | 'board';
  fieldsOpen: boolean;
  onCreate: () => void;
  onFieldsToggle: () => void;
  onDisplayChange: (display: 'list' | 'board') => void;
}) {
  return (
    <div className="relative mb-4 flex items-center justify-between">
      <h2 className="text-[13px] font-bold text-ink">Tasks</h2>
      <div className="flex items-center gap-2">
        <button className="h-8 rounded border border-line bg-panel px-3 text-[11px] font-semibold" onClick={onFieldsToggle} type="button">Fields</button>
        <button className="h-8 rounded border border-line bg-panel px-3 text-[11px] font-semibold" onClick={() => onDisplayChange(display === 'list' ? 'board' : 'list')} type="button">
          {display === 'list' ? 'Board' : 'List'}
        </button>
        <Button onClick={onCreate}>+ Add Task</Button>
      </div>
      {fieldsOpen ? (
        <div className="absolute right-16 top-10 z-20 w-60 rounded-md border border-line bg-panel p-3 shadow-soft">
          <div className="mb-3 grid grid-cols-2 rounded-md bg-surface p-1 text-[12px] font-semibold">
            <button className="rounded bg-panel py-2" onClick={() => onDisplayChange('list')} type="button">List</button>
            <button className="py-2" onClick={() => onDisplayChange('board')} type="button">Board</button>
          </div>
          {['Priority', 'Members', 'Due Date', 'Labels', 'Status', 'Reporter'].map((field, index) => (
            <label className="flex items-center justify-between py-2 text-[12px]" key={field}>
              {field}
              <input defaultChecked={index < 3} type="checkbox" />
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProjectStrip({ projects, tasks }: { projects: Project[]; tasks: Task[] }) {
  const projectCounts = tasks.reduce<Record<string, number>>((acc, task) => {
    const project = task.project || 'Deployment';
    acc[project] = (acc[project] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {projects.slice(0, 4).map((project) => (
          <div className="rounded border border-line bg-panel px-2 py-1" key={project._id}>
            <p className="text-[11px] font-bold text-ink">{project.name}</p>
            <p className="text-[10px] text-muted">{projectCounts[project.name] || 0} tasks</p>
          </div>
        ))}
        {!projects.length && !tasks.length ? (
          <div className="rounded border border-line bg-panel px-2 py-1">
            <p className="text-[11px] font-bold text-ink">Deployment</p>
            <p className="text-[10px] text-muted">Project workspace</p>
          </div>
        ) : null}
      </div>
      <p className="text-[11px] font-medium text-muted">{projects.length ? `${projects.reduce((total, project) => total + project.members.length, 0)} project member${projects.reduce((total, project) => total + project.members.length, 0) === 1 ? '' : 's'}` : 'Invite teammates to collaborate on a project'}</p>
    </div>
  );
}
