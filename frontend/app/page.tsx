'use client';

import { Chrome, Filter, Loader2, Plus, Pyramid, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { Project, ProjectInvite, Task, TaskInput, TaskPriority, TaskStatus, User } from '@/types/task';

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [lastInvite, setLastInvite] = useState<ProjectInvite | null>(null);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = !query || [
        task.title,
        task.description,
        task.project,
        task.assignee,
        task.label,
        task.status,
        task.priority,
      ].some((value) => value?.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [priorityFilter, searchQuery, statusFilter, tasks]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;

    return projects.filter((project) => [
      project.name,
      project.description,
      ...project.members.flatMap((member) => [member.name, member.email]),
    ].some((value) => value?.toLowerCase().includes(query)));
  }, [projects, searchQuery]);

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
      localStorage.removeItem('ablespace_pending_invite');
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
          <p className="mx-auto mt-3 max-w-xs rounded-md border border-line bg-panel px-3 py-2 text-xs leading-5 text-muted shadow-sm">
            This app uses Render free tier for the backend. If login feels slow, please wait up to 2 minutes while the server wakes up.
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
          onFieldsToggle={() => setFieldsOpen((open) => !open)}
          onFilterToggle={() => setFilterOpen((open) => !open)}
          onInvite={() => {
            setLastInvite(null);
            setInviteOpen(true);
          }}
          onLogout={handleLogout}
          onSearchFocus={() => document.getElementById('workspace-search')?.focus()}
        />
        <div className="px-3 py-4 lg:px-4">
          {activeView !== 'profile' ? <ProjectStrip projects={projects} tasks={filteredTasks} /> : null}
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
                filterOpen={filterOpen}
                priorityFilter={priorityFilter}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onClearFilters={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
                onCreate={() => openCreate()}
                onFieldsToggle={() => setFieldsOpen((open) => !open)}
                onFilterToggle={() => setFilterOpen((open) => !open)}
                onDisplayChange={setTaskDisplay}
                onPriorityFilterChange={setPriorityFilter}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
              />
              {taskDisplay === 'list' ? (
                <TasksListView tasks={filteredTasks} onCreate={openCreate} onOpen={setSelectedTask} />
              ) : (
                <KanbanBoard
                  tasks={filteredTasks}
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
              projects={filteredProjects}
              searchQuery={searchQuery}
              user={user}
              onCreate={handleCreateProject}
              onDelete={handleDeleteProject}
              onInvite={() => setInviteOpen(true)}
              onLeave={handleLeaveProject}
              onSearchChange={setSearchQuery}
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
  filterOpen,
  priorityFilter,
  searchQuery,
  statusFilter,
  onClearFilters,
  onCreate,
  onFieldsToggle,
  onFilterToggle,
  onDisplayChange,
  onPriorityFilterChange,
  onSearchChange,
  onStatusFilterChange,
}: {
  display: 'list' | 'board';
  fieldsOpen: boolean;
  filterOpen: boolean;
  priorityFilter: 'all' | TaskPriority;
  searchQuery: string;
  statusFilter: 'all' | TaskStatus;
  onClearFilters: () => void;
  onCreate: () => void;
  onFieldsToggle: () => void;
  onFilterToggle: () => void;
  onDisplayChange: (display: 'list' | 'board') => void;
  onPriorityFilterChange: (priority: 'all' | TaskPriority) => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: 'all' | TaskStatus) => void;
}) {
  const hasActiveFilters = Boolean(searchQuery.trim()) || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-[13px] font-bold text-ink">Tasks</h2>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <label className="flex h-8 min-w-[220px] items-center gap-2 rounded-md border border-line bg-panel px-2 text-[11px] text-muted transition focus-within:border-ink/40 focus-within:shadow-sm">
          <Search size={13} />
          <input
            id="workspace-search"
            className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-ink outline-none placeholder:text-muted"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, labels, people"
            type="search"
            value={searchQuery}
          />
          {searchQuery ? (
            <button aria-label="Clear search" className="text-muted hover:text-ink" onClick={() => onSearchChange('')} type="button">
              <X size={13} />
            </button>
          ) : null}
        </label>
        <button
          className={`inline-flex h-8 items-center gap-1 rounded-md border px-3 text-[11px] font-semibold transition ${hasActiveFilters ? 'border-ink bg-ink text-panel' : 'border-line bg-panel text-ink hover:bg-surface'}`}
          onClick={onFilterToggle}
          type="button"
        >
          <Filter size={13} />
          Filter
        </button>
        <button className="h-8 rounded-md border border-line bg-panel px-3 text-[11px] font-semibold hover:bg-surface" onClick={onFieldsToggle} type="button">Fields</button>
        <button className="h-8 rounded-md border border-line bg-panel px-3 text-[11px] font-semibold hover:bg-surface" onClick={() => onDisplayChange(display === 'list' ? 'board' : 'list')} type="button">
          {display === 'list' ? 'Board' : 'List'}
        </button>
        <Button onClick={onCreate}>+ Add Task</Button>
      </div>
      {filterOpen ? (
        <div className="absolute right-28 top-10 z-30 w-64 rounded-md border border-line bg-panel p-3 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-bold text-ink">Filters</p>
            {hasActiveFilters ? (
              <button className="text-[11px] font-semibold text-muted hover:text-ink" onClick={onClearFilters} type="button">Clear</button>
            ) : null}
          </div>
          <label className="mb-3 block text-[11px] font-semibold text-muted">
            Status
            <select
              className="mt-1 h-9 w-full rounded-md border border-line bg-surface px-2 text-[12px] text-ink outline-none focus:border-ink/40"
              onChange={(event) => onStatusFilterChange(event.target.value as 'all' | TaskStatus)}
              value={statusFilter}
            >
              <option value="all">All statuses</option>
              <option value="todo">To do</option>
              <option value="in-progress">Doing</option>
              <option value="done">Completed</option>
              <option value="on-hold">On hold</option>
            </select>
          </label>
          <label className="block text-[11px] font-semibold text-muted">
            Priority
            <select
              className="mt-1 h-9 w-full rounded-md border border-line bg-surface px-2 text-[12px] text-ink outline-none focus:border-ink/40"
              onChange={(event) => onPriorityFilterChange(event.target.value as 'all' | TaskPriority)}
              value={priorityFilter}
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
      ) : null}
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
