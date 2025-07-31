import express, { type Router } from "express";
import { authRouter } from "./auth/authRouter";
import { commonRouter } from "./common-api/commonRouter";
import { cropRouter } from "./crop/cropRouter";
import { dashboardRouter } from "./dashboard/dashboardRouter";
import { docsRouter } from "./docs/docsRouter";
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
allRoutes.use("/docs", docsRouter);
allRoutes.use("/common", commonRouter);
allRoutes.use("/admin", dashboardRouter);
