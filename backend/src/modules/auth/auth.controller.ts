import type { NextFunction, Request, Response } from "express";

import { loginSchema, registerSchema } from "./auth.validator.js";

import {
  getCurrentUser,
  loginUser,
  registerTenantAdmin,
} from "./auth.service.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = registerSchema.parse({
      body: req.body,
    });

    const result = await registerTenantAdmin(validatedData.body);

    res.status(201).json({
      success: true,
      message: "Tenant and admin user registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = loginSchema.parse({
      body: req.body,
    });

    const result = await loginUser(validatedData.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const user = await getCurrentUser(req.auth.userId, req.auth.tenantId);

    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
