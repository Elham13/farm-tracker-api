import express, { type Router } from "express";
import { GetUserSchema, UpdateUserSchema } from "@/api/user/userModel";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import isAdmin from "@/common/middleware/isAdmin";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRouter: Router = express.Router();

userRouter
  .route("/")
  .get(isProtected, isAdmin, asyncHandler(userController.getUsers))
  .put(
    isProtected,
    isAdmin,
    validateRequest(UpdateUserSchema),
    asyncHandler(userController.updateUser)
  );

userRouter
  .route("/:id")
  .get(
    isProtected,
    validateRequest(GetUserSchema),
    asyncHandler(userController.getUser)
  )
  .delete(
    isProtected,
    isAdmin,
    validateRequest(GetUserSchema),
    asyncHandler(userController.deleteUser)
  );
