import express, { type Router } from "express";
import { healthCheckRouter } from "./healthCheck/healthCheckRouter";
import { userRouter } from "./user/userRouter";

export const allRoutes: Router = express.Router();

allRoutes.use("/health-check", healthCheckRouter);
allRoutes.use("/users", userRouter);
