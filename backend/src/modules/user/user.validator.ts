import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),

    role: z.enum(["MANAGER", "MEMBER"]),
  }),
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((value) => Number(value))
      .refine(
        (value) => Number.isInteger(value) && value >= 1,
        "Page must be a positive integer",
      ),

    limit: z
      .string()
      .optional()
      .default("10")
      .transform((value) => Number(value))
      .refine(
        (value) => Number.isInteger(value) && value >= 1 && value <= 100,
        "Limit must be between 1 and 100",
      ),

    search: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined),

    role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).optional(),

    isActive: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => {
        if (value === undefined) {
          return undefined;
        }

        return value === "true";
      }),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];

export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>["query"];

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid("Please provide a valid user ID"),
  }),

  body: z.object({
    role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
  }),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>["body"];
