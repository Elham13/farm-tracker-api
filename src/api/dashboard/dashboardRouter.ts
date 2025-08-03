import express, { type Router } from "express";
import isAdmin from "@/common/middleware/isAdmin";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { dashboardController } from "./dashboardController";
import { GetFarmersData } from "./dashboardModel";

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

dashboardRouter
  .route("/get-aggregated-metrics")
  .get(isProtected, isAdmin, dashboardController.getAggregatedMetrics);

dashboardRouter
  .route("/get-crop-wise-emission")
  .get(isProtected, isAdmin, dashboardController.getCropWiseEmissions);

dashboardRouter
  .route("/get-farmers-data")
  .get(
    isProtected,
    isAdmin,
    validateRequest(GetFarmersData),
    dashboardController.getFarmersData
  );
dashboardRouter
  .route("/get-crop-wise-water-consumption")
  .get(isProtected, isAdmin, dashboardController.getCropWiseWaterConsumption);
