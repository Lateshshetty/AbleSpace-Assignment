import { API_URL, apiRequest, clearToken, setToken } from './api';
import { User } from '@/types/task';

export async function guestLogin() {
  const result = await apiRequest<{ accessToken: string }>('/auth/guest', {
    method: 'POST',
    auth: false,
  });
  setToken(result.accessToken);
  return result;
}

export function googleLogin() {
  window.location.href = `${API_URL}/auth/google`;
}

export function saveAuthToken(token: string) {
  setToken(token);
}

export function logout() {
  clearToken();
}

export function getMe() {
  return apiRequest<User>('/auth/me');
}

export function updateProfile(input: { name?: string; email?: string; avatar?: string }) {
  return apiRequest<User>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

