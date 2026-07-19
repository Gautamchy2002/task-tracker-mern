import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { generateAccessToken } from "../../utils/jwt.js";
import type { LoginInput, RegisterInput } from "./auth.validator.js";

export const registerTenantAdmin = async (input: RegisterInput) => {
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedSlug = input.tenantSlug.trim().toLowerCase();

  const existingTenant = await prisma.tenant.findUnique({
    where: {
      slug: normalizedSlug,
    },
  });

  if (existingTenant) {
    throw new Error("A tenant with this slug already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const result = await prisma.$transaction(async (transaction) => {
    const tenant = await transaction.tenant.create({
      data: {
        name: input.tenantName.trim(),
        slug: normalizedSlug,
      },
    });

    const user = await transaction.user.create({
      data: {
        name: input.name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "ADMIN",
        tenantId: tenant.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        tenantId: true,
        createdAt: true,
      },
    });

    return {
      tenant,
      user,
    };
  });

  return result;
};

export const loginUser = async (input: LoginInput) => {
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedSlug = input.tenantSlug.trim().toLowerCase();

  const tenant = await prisma.tenant.findUnique({
    where: {
      slug: normalizedSlug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!tenant) {
    throw new Error("Invalid tenant, email or password");
  }

  const user = await prisma.user.findUnique({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: normalizedEmail,
      },
    },
  });

  if (!user) {
    throw new Error("Invalid tenant, email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account is inactive");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid tenant, email or password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      tenantId: user.tenantId,
      createdAt: user.createdAt,
    },
    tenant,
  };
};
export const getCurrentUser = async (userId: string, tenantId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Authenticated user not found");
  }

  return user;
};
