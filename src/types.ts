// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for the Team Task Manager app
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  members?: User[];
  createdAt?: string;
}

export type TaskState = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  state: TaskState;
  assignee?: number;
  assignedUserName?: string;
  projectId?: number;
}

export interface Comment {
  id: number;
  description: string;
  taskId: number;
  userId: number;
  createdAt: string;
  User?: { id: number; name: string };
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  projects: Array<{ id: number; name: string }>;
  myTasks?: Array<{
    id: number;
    title: string;
    description: string;
    dueDate: string;
    state: TaskState;
    projectId: number;
    projectName: string;
  }>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
