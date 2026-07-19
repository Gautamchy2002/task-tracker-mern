import type { UserRole } from "../../generated/prisma/client.js";

export interface GetUsersQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface GetUsersRepositoryInput extends GetUsersQuery {
  tenantId: string;
}
