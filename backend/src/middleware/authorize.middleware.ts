import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "../generated/prisma/client.js";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });

      return;
    }

    next();
  };
};
