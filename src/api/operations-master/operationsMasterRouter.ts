import isProtected from "@/common/middleware/isProtected";
import express, { Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import {
  AddOperationsMasterBodySchema,
  GetOperationsMasterByIdSchema,
  GetOperationsMastersSchema,
} from "./operationsMasterModel";
import { operationMasterController } from "./operationsMasterController";

export const operationMasterRouter: Router = express.Router();

operationMasterRouter
  .route("/")
  .get(
    isProtected,
    validateRequest(GetOperationsMastersSchema),
    operationMasterController.getOperationMasters
  )
  .post(
    isProtected,
    validateRequest(AddOperationsMasterBodySchema),
    operationMasterController.addOperationMaster
  );

operationMasterRouter.get(
  "/:id",
  isProtected,
  validateRequest(GetOperationsMasterByIdSchema),
  operationMasterController.getOperationMasterById
);
