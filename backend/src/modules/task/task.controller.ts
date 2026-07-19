import type { NextFunction, Request, Response } from "express";

import {
  addComment,
  createTask,
  deleteTask,
  getTaskById,
  getTaskComments,
  getTasks,
  updateTask,
} from "./task.service.js";

import {
  createCommentSchema,
  createTaskSchema,
  taskIdParamSchema,
  taskListQuerySchema,
  updateTaskSchema,
} from "./task.validator.js";

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

    const validatedData = createTaskSchema.parse({
      body: req.body,
    });

    const task = await createTask(
      validatedData.body,
      req.auth.tenantId,
      req.auth.userId,
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task,
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

    const validatedData = taskListQuerySchema.parse({
      query: req.query,
    });

    const result = await getTasks({
      tenantId: req.auth.tenantId,
      userId: req.auth.userId,
      role: req.auth.role,
      query: validatedData.query,
    });

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const getById = async (
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

    const validatedData = taskIdParamSchema.parse({
      params: req.params,
    });

    const task = await getTaskById({
      taskId: validatedData.params.id,
      tenantId: req.auth.tenantId,
      userId: req.auth.userId,
      role: req.auth.role,
    });

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const update = async (
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

    const validatedData = updateTaskSchema.parse({
      params: req.params,
      body: req.body,
    });

    const task = await updateTask({
      taskId: validatedData.params.id,
      tenantId: req.auth.tenantId,
      userId: req.auth.userId,
      role: req.auth.role,
      input: validatedData.body,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const remove = async (
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

    const validatedData = taskIdParamSchema.parse({
      params: req.params,
    });

    const deletedTask = await deleteTask({
      taskId: validatedData.params.id,
      tenantId: req.auth.tenantId,
      userId: req.auth.userId,
      role: req.auth.role,
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: {
        task: deletedTask,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const createComment = async (
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

    const validatedData = createCommentSchema.parse({
      params: req.params,
      body: req.body,
    });

    const comment = await addComment({
      taskId: validatedData.params.id,
      tenantId: req.auth.tenantId,
      userId: req.auth.userId,
      role: req.auth.role,
      input: validatedData.body,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const listComments = async (
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

    const validatedData = taskIdParamSchema.parse({
      params: req.params,
    });

    const comments = await getTaskComments({
      taskId: validatedData.params.id,
      tenantId: req.auth.tenantId,
      userId: req.auth.userId,
      role: req.auth.role,
    });

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: {
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};
