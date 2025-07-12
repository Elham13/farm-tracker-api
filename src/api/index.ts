import express, { type Router } from "express";
import { authRouter } from "./auth/authRouter";
import { healthCheckRouter } from "./healthCheck/healthCheckRouter";
import { userRouter } from "./user/userRouter";

export const allRoutes: Router = express.Router();

allRoutes.use("/health-check", healthCheckRouter);
allRoutes.use("/users", userRouter);
allRoutes.use("/auth", authRouter);
