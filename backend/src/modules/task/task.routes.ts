import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

import {
  create,
  createComment,
  getById,
  list,
  listComments,
  remove,
  update,
} from "./task.controller.js";

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.post("/", authorize("ADMIN", "MANAGER"), create);

taskRouter.get("/", authorize("ADMIN", "MANAGER", "MEMBER"), list);
taskRouter.post(
  "/:id/comments",
  authorize("ADMIN", "MANAGER", "MEMBER"),
  createComment,
);
taskRouter.get(
  "/:id/comments",
  authorize("ADMIN", "MANAGER", "MEMBER"),
  listComments,
);
taskRouter.get("/:id", authorize("ADMIN", "MANAGER", "MEMBER"), getById);
taskRouter.put("/:id", authorize("ADMIN", "MANAGER", "MEMBER"), update);
taskRouter.delete("/:id", authorize("ADMIN", "MANAGER"), remove);

export default taskRouter;
