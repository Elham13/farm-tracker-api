import express, { type Router } from "express";
import { GetUserSchema } from "@/api/user/userModel";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import isAdmin from "@/common/middleware/isAdmin";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRouter: Router = express.Router();

userRouter
  .route("/")
  .get(isProtected, isAdmin, asyncHandler(userController.getUsers));

userRouter.get(
  "/:id",
  isProtected,
  validateRequest(GetUserSchema),
  asyncHandler(userController.getUser)
);
