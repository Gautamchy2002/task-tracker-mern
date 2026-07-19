import { z } from "zod";

import { TaskPriority, TaskStatus } from "../../generated/prisma/client.js";

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, "Title must contain at least 2 characters")
      .max(150, "Title cannot exceed 150 characters"),

    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),

    priority: z.nativeEnum(TaskPriority),

    status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.TODO),

    dueDate: z
      .string()
      .datetime({
        offset: true,
        message: "Due date must be a valid ISO date",
      })
      .transform((value) => new Date(value))
      .optional(),

    assignedToId: z
      .string()
      .uuid("Assigned user ID must be a valid UUID")
      .optional(),
  }),
});

export const taskListQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(10),

    search: z.string().trim().optional(),

    status: z.nativeEnum(TaskStatus).optional(),

    priority: z.nativeEnum(TaskPriority).optional(),

    assignedToId: z
      .string()
      .uuid("Assigned user ID must be a valid UUID")
      .optional(),

    sortBy: z
      .enum(["createdAt", "updatedAt", "dueDate", "title"])
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];

export type TaskListQuery = z.infer<typeof taskListQuerySchema>["query"];
export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Task ID must be a valid UUID"),
  }),
});

export type TaskIdParams = z.infer<typeof taskIdParamSchema>["params"];
export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid("Task ID must be a valid UUID"),
  }),

  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(2, "Title must contain at least 2 characters")
        .max(150, "Title cannot exceed 150 characters")
        .optional(),

      description: z
        .string()
        .trim()
        .max(2000, "Description cannot exceed 2000 characters")
        .nullable()
        .optional(),

      priority: z.nativeEnum(TaskPriority).optional(),

      status: z.nativeEnum(TaskStatus).optional(),

      dueDate: z
        .string()
        .datetime({
          offset: true,
          message: "Due date must be a valid ISO date",
        })
        .transform((value) => new Date(value))
        .nullable()
        .optional(),

      assignedToId: z
        .string()
        .uuid("Assigned user ID must be a valid UUID")
        .nullable()
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    }),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
export const createCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Task ID must be a valid UUID"),
  }),

  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty")
      .max(1000, "Comment cannot exceed 1000 characters"),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
