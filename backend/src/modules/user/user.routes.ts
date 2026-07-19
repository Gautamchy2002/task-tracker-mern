import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import { authorize } from "../../middleware/authorize.middleware.js";

import { create, list, updateRole } from "./user.controller.js";

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get("/", authorize("ADMIN", "MANAGER"), list);

userRouter.post("/", authorize("ADMIN"), create);

userRouter.put("/:id/role", authorize("ADMIN"), updateRole);

export default userRouter;
