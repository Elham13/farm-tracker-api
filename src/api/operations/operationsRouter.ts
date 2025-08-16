import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { operationsController } from "./operationsController";
import {
  AddOperationsBodySchema,
  DownloadOperationDetailsSchema,
  GetOperationsByIdSchema,
  GetOperationsSchema,
  UpdateOperationsBodySchema,
} from "./operationsModel";

export const operationsRouter: Router = express.Router();

operationsRouter
  .route("/")
  .get(
    isProtected,
    validateRequest(GetOperationsSchema),
    operationsController.getOperations
  )
  .post(
    isProtected,
    validateRequest(AddOperationsBodySchema),
    operationsController.addOperation
  )
  .put(
    isProtected,
    validateRequest(UpdateOperationsBodySchema),
    operationsController.updateOperations
  );

operationsRouter.get(
  "/download-operations-details",
  isProtected,
  validateRequest(DownloadOperationDetailsSchema),
  operationsController.downloadOperationDetails
);

operationsRouter
  .route("/:id")
  .get(
    isProtected,
    validateRequest(GetOperationsByIdSchema),
    operationsController.getOperationById
  )
  .delete(
    isProtected,
    validateRequest(GetOperationsByIdSchema),
    operationsController.deleteOperation
  );
