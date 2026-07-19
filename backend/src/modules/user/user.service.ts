import bcrypt from "bcrypt";

import {
  createUserRecord,
  findUserByIdAndTenant,
  findUserByTenantAndEmail,
  findUsers,
  updateUserRoleRecord,
} from "./user.repository.js";

import type {
  CreateUserInput,
  GetUsersQueryInput,
  UpdateUserRoleInput,
} from "./user.validator.js";
import { AppError } from "../../utils/AppError.js";

export const createUser = async (input: CreateUserInput, tenantId: string) => {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingUser = await findUserByTenantAndEmail(
    tenantId,
    normalizedEmail,
  );

  if (existingUser) {
    throw new Error("A user with this email already exists in your tenant");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  return createUserRecord({
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: input.role,
    tenantId,
  });
};

export const getUsers = async (query: GetUsersQueryInput, tenantId: string) => {
  const result = await findUsers({
    tenantId,
    page: query.page,
    limit: query.limit,
    search: query.search,
    role: query.role,
    isActive: query.isActive,
  });

  const totalPages = Math.ceil(result.total / query.limit);

  return {
    users: result.users,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
};
export const updateUserRole = async (
  userId: string,
  input: UpdateUserRoleInput,
  tenantId: string,
  loggedInUserId: string,
) => {
  const existingUser = await findUserByIdAndTenant(userId, tenantId);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  if (userId === loggedInUserId) {
    throw new AppError("You cannot change your own role", 403);
  }

  if (existingUser.role === input.role) {
    throw new AppError(`User already has the ${input.role} role`, 400);
  }

  return updateUserRoleRecord(userId, tenantId, input.role);
};
