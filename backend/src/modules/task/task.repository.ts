import type { Prisma, UserRole } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

import type { TaskListQuery } from "./task.validator.js";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  priority: true,
  status: true,
  dueDate: true,
  tenantId: true,
  createdById: true,
  assignedToId: true,
  createdAt: true,
  updatedAt: true,

  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },

  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  },
} satisfies Prisma.TaskSelect;

export const findUserForTaskAssignment = async (
  userId: string,
  tenantId: string,
) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
      role: "MEMBER",
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

export const createTaskRecord = async (
  data: Prisma.TaskUncheckedCreateInput,
) => {
  return prisma.task.create({
    data,
    select: taskSelect,
  });
};

type FindTasksParams = {
  tenantId: string;
  userId: string;
  role: UserRole;
  query: TaskListQuery;
};

const buildTaskWhereCondition = ({
  tenantId,
  userId,
  role,
  query,
}: FindTasksParams): Prisma.TaskWhereInput => {
  const where: Prisma.TaskWhereInput = {
    tenantId,
  };

  /*
   * ADMIN:
   * Tenant ke saare tasks dekh sakta hai.
   *
   * MANAGER:
   * Apne create kiye hue tasks dekh sakta hai.
   *
   * MEMBER:
   * Sirf khud ko assigned tasks dekh sakta hai.
   */
  if (role === "MANAGER") {
    where.createdById = userId;
  }

  if (role === "MEMBER") {
    where.assignedToId = userId;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.assignedToId) {
    where.assignedToId = query.assignedToId;
  }

  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
};

export const findTasks = async (params: FindTasksParams) => {
  const { query } = params;

  const where = buildTaskWhereCondition(params);

  const skip = (query.page - 1) * query.limit;

  const orderBy: Prisma.TaskOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: query.limit,
      orderBy,
      select: taskSelect,
    }),

    prisma.task.count({
      where,
    }),
  ]);

  return {
    tasks,
    total,
  };
};
type FindTaskByIdParams = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const findTaskById = async ({
  taskId,
  tenantId,
  userId,
  role,
}: FindTaskByIdParams) => {
  const where: Prisma.TaskWhereInput = {
    id: taskId,
    tenantId,
  };

  if (role === "MANAGER") {
    where.createdById = userId;
  }

  if (role === "MEMBER") {
    where.assignedToId = userId;
  }

  return prisma.task.findFirst({
    where,
    select: {
      ...taskSelect,

      comments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,

          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });
};
type FindTaskForUpdateParams = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const findTaskForUpdate = async ({
  taskId,
  tenantId,
  userId,
  role,
}: FindTaskForUpdateParams) => {
  const where: Prisma.TaskWhereInput = {
    id: taskId,
    tenantId,
  };

  if (role === "MANAGER") {
    where.createdById = userId;
  }

  if (role === "MEMBER") {
    where.assignedToId = userId;
  }

  return prisma.task.findFirst({
    where,
    select: {
      id: true,
      tenantId: true,
      createdById: true,
      assignedToId: true,
      status: true,
    },
  });
};

export const updateTaskRecord = async (
  taskId: string,
  data: Prisma.TaskUncheckedUpdateInput,
) => {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data,
    select: taskSelect,
  });
};
type FindTaskForDeleteParams = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const findTaskForDelete = async ({
  taskId,
  tenantId,
  userId,
  role,
}: FindTaskForDeleteParams) => {
  const where: Prisma.TaskWhereInput = {
    id: taskId,
    tenantId,
  };

  if (role === "MANAGER") {
    where.createdById = userId;
  }

  return prisma.task.findFirst({
    where,
    select: {
      id: true,
      title: true,
      tenantId: true,
      createdById: true,
    },
  });
};

export const deleteTaskRecord = async (taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
    select: {
      id: true,
      title: true,
    },
  });
};
type FindTaskForCommentParams = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const findTaskForComment = async ({
  taskId,
  tenantId,
  userId,
  role,
}: FindTaskForCommentParams) => {
  const where: Prisma.TaskWhereInput = {
    id: taskId,
    tenantId,
  };

  if (role === "MANAGER") {
    where.createdById = userId;
  }

  if (role === "MEMBER") {
    where.assignedToId = userId;
  }

  return prisma.task.findFirst({
    where,
    select: {
      id: true,
      tenantId: true,
      createdById: true,
      assignedToId: true,
    },
  });
};

export const createCommentRecord = async (
  data: Prisma.CommentUncheckedCreateInput,
) => {
  return prisma.comment.create({
    data,
    select: {
      id: true,
      content: true,
      taskId: true,
      authorId: true,
      tenantId: true,
      createdAt: true,
      updatedAt: true,

      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};
type FindCommentsByTaskParams = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const findCommentsByTask = async ({
  taskId,
  tenantId,
  userId,
  role,
}: FindCommentsByTaskParams) => {
  const taskWhere: Prisma.TaskWhereInput = {
    id: taskId,
    tenantId,
  };

  if (role === "MANAGER") {
    taskWhere.createdById = userId;
  }

  if (role === "MEMBER") {
    taskWhere.assignedToId = userId;
  }

  const task = await prisma.task.findFirst({
    where: taskWhere,
    select: {
      id: true,
    },
  });

  if (!task) {
    return null;
  }

  const comments = await prisma.comment.findMany({
    where: {
      taskId,
      tenantId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      content: true,
      taskId: true,
      authorId: true,
      tenantId: true,
      createdAt: true,
      updatedAt: true,

      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return comments;
};
