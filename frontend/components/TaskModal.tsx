'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './Button';
import { Input, Textarea } from './Input';
import { Select } from './Select';
import { Project, Task, TaskInput, User } from '@/types/task';

const schema = z.object({
  title: z.string().min(2, 'Title is required').max(120, 'Keep title under 120 characters'),
  description: z.string().max(1000, 'Keep description under 1000 characters').optional(),
  status: z.enum(['todo', 'in-progress', 'done', 'on-hold']),
  priority: z.enum(['low', 'medium', 'high']),
  projectId: z.string().optional(),
  project: z.string().max(80, 'Keep project under 80 characters').optional(),
  assignee: z.string().max(80, 'Keep assignee under 80 characters').optional(),
  label: z.string().max(80, 'Keep label under 80 characters').optional(),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type TaskModalProps = {
  open: boolean;
  task?: Task | null;
  projects: Project[];
  currentUser: User | null;
  initialStatus?: Task['status'];
  busy: boolean;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
};

export function TaskModal({ open, task, projects, currentUser, initialStatus = 'todo', busy, onClose, onSubmit }: TaskModalProps) {
  const defaultProject = projects[0];
  const defaultAssignee = currentUser?.name || currentUser?.email || 'User';
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: initialStatus,
      priority: 'medium',
      projectId: defaultProject?._id || '',
      project: defaultProject?.name || 'Deployment',
      assignee: defaultAssignee,
      label: 'Deployment',
      dueDate: '',
    },
  });

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? initialStatus,
      priority: task?.priority ?? 'medium',
      projectId: task?.projectId ?? defaultProject?._id ?? '',
      project: task?.project ?? defaultProject?.name ?? 'Deployment',
      assignee: task?.assignee ?? defaultAssignee,
      label: task?.label ?? 'Deployment',
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    });
  }, [task, reset, open, initialStatus, defaultProject?._id, defaultProject?.name, defaultAssignee]);

  if (!open) return null;

  const selectedProjectName = projects.find((project) => project._id === watch('projectId'))?.name;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <form
        className="max-h-[calc(100vh-2rem)] w-full max-w-3xl animate-fade-up overflow-y-auto rounded-2xl border border-line bg-panel p-5 shadow-glow sm:p-6"
        onSubmit={handleSubmit((values) =>
          onSubmit({
            ...values,
            description: values.description || undefined,
            dueDate: values.dueDate || undefined,
            projectId: values.projectId || undefined,
            project: selectedProjectName || values.project || undefined,
            assignee: values.assignee || undefined,
            label: values.label || undefined,
          }),
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">{task ? 'Edit task' : 'Create task'}</h2>
          <button aria-label="Close dialog" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4">
          <Input label="Title" placeholder="Prepare assessment walkthrough" error={errors.title?.message} {...register('title')} />
          <Textarea label="Description" placeholder="Add useful context" error={errors.description?.message} {...register('description')} />
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Status" {...register('status')}>
              <option value="todo">To do</option>
              <option value="in-progress">Doing</option>
              <option value="done">Completed</option>
              <option value="on-hold">On Hold</option>
            </Select>
            <Select label="Priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Input label="Due date" type="date" {...register('dueDate')} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Project" {...register('projectId')}>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Select>
            <Input label="Assignee" placeholder={defaultAssignee} {...register('assignee')} />
            <Input label="Label" placeholder="Design" {...register('label')} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button disabled={busy} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button disabled={busy} type="submit">
            {busy ? 'Saving...' : 'Save task'}
          </Button>
        </div>
      </form>
    </div>
  );
}
