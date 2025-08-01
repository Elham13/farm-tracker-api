import express, { type Router } from "express";
import isAdmin from "@/common/middleware/isAdmin";
import isProtected from "@/common/middleware/isProtected";
import { dashboardController } from "./dashboardController";

export const dashboardRouter: Router = express.Router();

dashboardRouter
  .route("/get-dashboard-counts")
  .get(isProtected, isAdmin, dashboardController.getDashboardCounts);

dashboardRouter
  .route("/get-all-operations")
  .get(isProtected, isAdmin, dashboardController.getAllOperations);

dashboardRouter
  .route("/get-all-crops")
  .get(isProtected, isAdmin, dashboardController.getAllCrops);
