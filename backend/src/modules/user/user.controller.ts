import type { NextFunction, Request, Response } from "express";

import {
  createUserSchema,
  getUsersQuerySchema,
  updateUserRoleSchema,
} from "./user.validator.js";

import { createUser, getUsers, updateUserRole } from "./user.service.js";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const validatedData = createUserSchema.parse({
      body: req.body,
    });

    const user = await createUser(validatedData.body, req.auth.tenantId);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const validatedData = getUsersQuerySchema.parse({
      query: req.query,
    });

    const result = await getUsers(validatedData.query, req.auth.tenantId);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const validatedData = updateUserRoleSchema.parse({
      params: req.params,
      body: req.body,
    });

    const user = await updateUserRole(
      validatedData.params.id,
      validatedData.body,
      req.auth.tenantId,
      req.auth.userId,
    );

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
