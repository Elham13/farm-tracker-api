import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import upload from "@/common/middleware/upload";
import { validateRequest } from "@/common/utils/httpHandlers";
import { operationMasterController } from "./operationsMasterController";
import {
  AddOperationsMasterBodySchema,
  GetOperationsMasterByIdSchema,
  UpdateOperationsMasterBodySchema,
} from "./operationsMasterModel";

export const operationMasterRouter: Router = express.Router();

operationMasterRouter
  .route("/")
  .get(isProtected, operationMasterController.getOperationMasters)
  .post(
    isProtected,
    upload.single("icon"),
    validateRequest(AddOperationsMasterBodySchema),
    operationMasterController.addOperationMaster
  )
  .put(
    isProtected,
    validateRequest(UpdateOperationsMasterBodySchema),
    operationMasterController.updateOperationsMaster
  );

operationMasterRouter
  .route("/:id")
  .get(
    isProtected,
    validateRequest(GetOperationsMasterByIdSchema),
    operationMasterController.getOperationMasterById
  )
  .delete(
    isProtected,
    validateRequest(GetOperationsMasterByIdSchema),
    operationMasterController.deleteOperationsMaster
  );
