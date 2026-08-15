export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'on-hold';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  project?: string;
  assignee?: string;
  label?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isGuest: boolean;
};

export type ProjectMember = {
  userId: string;
  name: string;
  email?: string;
  role: 'owner' | 'member';
  joinedAt: string;
};

export type Project = {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectInvite = {
  id: string;
  email: string;
  status: 'pending' | 'accepted';
  acceptUrl: string;
  mailtoHref: string;
};

export type TaskInput = {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  project?: string;
  assignee?: string;
  label?: string;
  dueDate?: string;
};
