'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './Button';
import { Input, Textarea } from './Input';
import { Select } from './Select';
import { Task, TaskInput } from '@/types/task';

const schema = z.object({
  title: z.string().min(2, 'Title is required').max(120, 'Keep title under 120 characters'),
  description: z.string().max(1000, 'Keep description under 1000 characters').optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type TaskModalProps = {
  open: boolean;
  task?: Task | null;
  busy: boolean;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
};

export function TaskModal({ open, task, busy, onClose, onSubmit }: TaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    },
  });

  useEffect(() => {
    reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'todo',
      priority: task?.priority ?? 'medium',
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    });
  }, [task, reset, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <form
        className="w-full max-w-xl rounded-2xl border border-line bg-panel p-5 shadow-soft"
        onSubmit={handleSubmit((values) => onSubmit(values))}
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
          <div className="grid gap-4 sm:grid-cols-3">
            <Select label="Status" {...register('status')}>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </Select>
            <Select label="Priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
            <Input label="Due date" type="date" {...register('dueDate')} />
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

