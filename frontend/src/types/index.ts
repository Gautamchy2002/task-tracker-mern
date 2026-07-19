export type UserRole = "ADMIN" | "MANAGER" | "MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  author: Pick<User, "id" | "name" | "email" | "role">;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  tenantId: string;
  createdById: string;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: Pick<User, "id" | "name" | "email" | "role">;
  assignedTo?: Pick<User, "id" | "name" | "email" | "role"> | null;
  comments?: TaskComment[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  tenant: Tenant;
}
