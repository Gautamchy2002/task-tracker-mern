import type { Prisma, UserRole } from "../../generated/prisma/client.js";

import {
  createCommentRecord,
  createTaskRecord,
  deleteTaskRecord,
  findCommentsByTask,
  findTaskById,
  findTaskForComment,
  findTaskForDelete,
  findTaskForUpdate,
  findTasks,
  findUserForTaskAssignment,
  updateTaskRecord,
} from "./task.repository.js";

import type {
  CreateCommentInput,
  CreateTaskInput,
  TaskListQuery,
  UpdateTaskInput,
} from "./task.validator.js";

export const createTask = async (
  input: CreateTaskInput,
  tenantId: string,
  loggedInUserId: string,
) => {
  let assignedUserId: string | null = null;

  if (input.assignedToId) {
    const assignedUser = await findUserForTaskAssignment(
      input.assignedToId,
      tenantId,
    );

    if (!assignedUser) {
      throw new Error("Assigned member was not found or is inactive");
    }

    assignedUserId = assignedUser.id;
  }

  const task = await createTaskRecord({
    title: input.title.trim(),
    description: input.description?.trim() || null,
    priority: input.priority,
    status: input.status,
    dueDate: input.dueDate ?? null,
    tenantId,
    createdById: loggedInUserId,
    assignedToId: assignedUserId,
  });

  return task;
};

type GetTasksInput = {
  tenantId: string;
  userId: string;
  role: UserRole;
  query: TaskListQuery;
};

export const getTasks = async ({
  tenantId,
  userId,
  role,
  query,
}: GetTasksInput) => {
  const { tasks, total } = await findTasks({
    tenantId,
    userId,
    role,
    query,
  });

  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  return {
    tasks,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
};
type GetTaskByIdInput = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const getTaskById = async ({
  taskId,
  tenantId,
  userId,
  role,
}: GetTaskByIdInput) => {
  const task = await findTaskById({
    taskId,
    tenantId,
    userId,
    role,
  });

  if (!task) {
    throw new Error("Task not found or you do not have permission to view it");
  }

  return task;
};
type UpdateTaskServiceInput = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
  input: UpdateTaskInput;
};

export const updateTask = async ({
  taskId,
  tenantId,
  userId,
  role,
  input,
}: UpdateTaskServiceInput) => {
  const existingTask = await findTaskForUpdate({
    taskId,
    tenantId,
    userId,
    role,
  });

  if (!existingTask) {
    throw new Error(
      "Task not found or you do not have permission to update it",
    );
  }

  /*
   * MEMBER sirf assigned task ka status update kar sakta hai.
   */
  if (role === "MEMBER") {
    const requestedFields = Object.keys(input);

    const hasRestrictedField = requestedFields.some(
      (field) => field !== "status",
    );

    if (hasRestrictedField) {
      throw new Error("Members can only update the task status");
    }

    if (!input.status) {
      throw new Error("Status is required for member task update");
    }

    return updateTaskRecord(taskId, {
      status: input.status,
    });
  }

  /*
   * ADMIN aur MANAGER assignee change kar sakte hain.
   * Assignee same tenant ka active MEMBER hona chahiye.
   */
  if (input.assignedToId) {
    const assignedUser = await findUserForTaskAssignment(
      input.assignedToId,
      tenantId,
    );

    if (!assignedUser) {
      throw new Error("Assigned member was not found or is inactive");
    }
  }

  const updateData: Prisma.TaskUncheckedUpdateInput = {};

  if (input.title !== undefined) {
    updateData.title = input.title.trim();
  }

  if (input.description !== undefined) {
    updateData.description = input.description?.trim() || null;
  }

  if (input.priority !== undefined) {
    updateData.priority = input.priority;
  }

  if (input.status !== undefined) {
    updateData.status = input.status;
  }

  if (input.dueDate !== undefined) {
    updateData.dueDate = input.dueDate;
  }

  if (input.assignedToId !== undefined) {
    updateData.assignedToId = input.assignedToId;
  }

  return updateTaskRecord(taskId, updateData);
};
type DeleteTaskServiceInput = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const deleteTask = async ({
  taskId,
  tenantId,
  userId,
  role,
}: DeleteTaskServiceInput) => {
  const existingTask = await findTaskForDelete({
    taskId,
    tenantId,
    userId,
    role,
  });

  if (!existingTask) {
    throw new Error(
      "Task not found or you do not have permission to delete it",
    );
  }

  return deleteTaskRecord(taskId);
};
type AddCommentServiceInput = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
  input: CreateCommentInput;
};

export const addComment = async ({
  taskId,
  tenantId,
  userId,
  role,
  input,
}: AddCommentServiceInput) => {
  const task = await findTaskForComment({
    taskId,
    tenantId,
    userId,
    role,
  });

  if (!task) {
    throw new Error(
      "Task not found or you do not have permission to comment on it",
    );
  }

  return createCommentRecord({
    content: input.content.trim(),
    tenantId,
    taskId,
    authorId: userId,
  });
};
type GetTaskCommentsServiceInput = {
  taskId: string;
  tenantId: string;
  userId: string;
  role: UserRole;
};

export const getTaskComments = async ({
  taskId,
  tenantId,
  userId,
  role,
}: GetTaskCommentsServiceInput) => {
  const comments = await findCommentsByTask({
    taskId,
    tenantId,
    userId,
    role,
  });

  if (!comments) {
    throw new Error(
      "Task not found or you do not have permission to view its comments",
    );
  }

  return comments;
};
