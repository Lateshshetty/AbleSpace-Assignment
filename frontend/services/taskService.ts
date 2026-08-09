import { Task, TaskInput } from '@/types/task';
import { apiRequest } from './api';

export function getTasks() {
  return apiRequest<Task[]>('/tasks');
}

export function createTask(input: TaskInput) {
  return apiRequest<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTask(id: string, input: Partial<TaskInput>) {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: string) {
  return apiRequest<{ ok: boolean }>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

