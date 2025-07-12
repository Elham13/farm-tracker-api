import express, { type Router } from "express";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { validateRequest } from "@/common/utils/httpHandlers";
import { CreateUserSchema } from "../user/userModel";
import { authController } from "./authController";
import { LoginRequestSchema } from "./authModel";

export const authRouter: Router = express.Router();

authRouter
  .route("/register")
  .post(
    validateRequest(CreateUserSchema),
    asyncHandler(authController.register)
  );

authRouter
  .route("/login")
  .post(
    validateRequest(LoginRequestSchema),
    asyncHandler(authController.login)
  );
