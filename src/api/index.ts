import express, { type Router } from "express";
import { authRouter } from "./auth/authRouter";
import { cropRouter } from "./crop/cropRouter";
import { efRouter } from "./emission-factor/efRouter";
import { efmRouter } from "./emission-factor-master/efmRouter";
import { farmRouter } from "./farm/farmRouter";
import { healthCheckRouter } from "./healthCheck/healthCheckRouter";
import { operationsRouter } from "./operations/operationsRouter";
import { operationMasterRouter } from "./operations-master/operationsMasterRouter";
import { userRouter } from "./user/userRouter";

export const allRoutes: Router = express.Router();

allRoutes.use("/health-check", healthCheckRouter);
allRoutes.use("/users", userRouter);
allRoutes.use("/auth", authRouter);
allRoutes.use("/farms", farmRouter);
allRoutes.use("/crops", cropRouter);
allRoutes.use("/operations-master", operationMasterRouter);
allRoutes.use("/operations", operationsRouter);
allRoutes.use("/efm", efmRouter);
allRoutes.use("/emission-factor", efRouter);
