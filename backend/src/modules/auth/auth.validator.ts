import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    tenantName: z
      .string()
      .trim()
      .min(2, "Tenant name must contain at least 2 characters")
      .max(100, "Tenant name cannot exceed 100 characters"),

    tenantSlug: z
      .string()
      .trim()
      .min(2, "Tenant slug must contain at least 2 characters")
      .max(50, "Tenant slug cannot exceed 50 characters")
      .regex(
        /^[a-z0-9-]+$/,
        "Tenant slug can only contain lowercase letters, numbers and hyphens",
      ),

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
  }),
});

export const loginSchema = z.object({
  body: z.object({
    tenantSlug: z
      .string()
      .trim()
      .min(1, "Tenant slug is required")
      .transform((slug) => slug.toLowerCase()),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((email) => email.toLowerCase()),

    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
