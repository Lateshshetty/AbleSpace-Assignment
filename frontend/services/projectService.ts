import { Project, ProjectInvite } from '@/types/task';
import { apiRequest } from './api';

export function getProjects() {
  return apiRequest<Project[]>('/projects');
}

export function createProject(input: { name: string; description?: string }) {
  return apiRequest<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function inviteToProject(projectId: string, email: string) {
  return apiRequest<ProjectInvite>(`/projects/${projectId}/invites`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function acceptProjectInvite(token: string) {
  return apiRequest<Project>('/projects/invites/accept', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function leaveProject(projectId: string) {
  return apiRequest<{ ok: boolean }>(`/projects/${projectId}/leave`, {
    method: 'POST',
  });
}

export function deleteProject(projectId: string) {
  return apiRequest<{ ok: boolean }>(`/projects/${projectId}`, {
    method: 'DELETE',
  });
}
