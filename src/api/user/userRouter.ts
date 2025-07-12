import express, { type Router } from "express";
import { GetUserSchema } from "@/api/user/userModel";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRouter: Router = express.Router();

userRouter.route("/").get(asyncHandler(userController.getUsers));

userRouter.get(
  "/:id",
  validateRequest(GetUserSchema),
  asyncHandler(userController.getUser)
);
