import { Request } from 'express';

export type AuthUser = {
  userId: string;
  email?: string;
  name: string;
  isGuest: boolean;
};

export type AuthenticatedRequest = Request & {
  user: AuthUser;
};

