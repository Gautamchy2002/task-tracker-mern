import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

import type { GetUsersRepositoryInput } from "./user.types.js";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const findUserByTenantAndEmail = async (
  tenantId: string,
  email: string,
) => {
  return prisma.user.findUnique({
    where: {
      tenantId_email: {
        tenantId,
        email,
      },
    },
  });
};

export const createUserRecord = async (
  data: Prisma.UserUncheckedCreateInput,
) => {
  return prisma.user.create({
    data,
    select: safeUserSelect,
  });
};

export const findUsers = async (input: GetUsersRepositoryInput) => {
  const { tenantId, page, limit, search, role, isActive } = input;

  const where: Prisma.UserWhereInput = {
    tenantId,
    ...(role !== undefined && {
      role,
    }),
    ...(isActive !== undefined && {
      isActive,
    }),
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: safeUserSelect,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    users,
    total,
  };
};
export const findUserByIdAndTenant = async (
  userId: string,
  tenantId: string,
) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
    },
    select: safeUserSelect,
  });
};

export const updateUserRoleRecord = async (
  userId: string,
  tenantId: string,
  role: "ADMIN" | "MANAGER" | "MEMBER",
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: safeUserSelect,
  });
};
