import express, { type Router } from "express";
import isAdmin from "@/common/middleware/isAdmin";
import isProtected from "@/common/middleware/isProtected";
import { commonController } from "./commonController";
import { validateRequest } from "@/common/utils/httpHandlers";
import { GetAllEmissionsQuery } from "./commonModel";

export const commonRouter: Router = express.Router();

commonRouter.get(
  "/init-emission-factors",
  isProtected,
  isAdmin,
  commonController.initializeEmissionFactors
);

commonRouter.get(
  "/emissions",
  isProtected,
  isAdmin,
  validateRequest(GetAllEmissionsQuery),
  commonController.getAllEmission
);
