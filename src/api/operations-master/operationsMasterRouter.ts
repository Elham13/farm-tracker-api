import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { operationMasterController } from "./operationsMasterController";
import {
  AddOperationsMasterBodySchema,
  GetOperationsMasterByIdSchema,
  GetOperationsMastersSchema,
} from "./operationsMasterModel";

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
