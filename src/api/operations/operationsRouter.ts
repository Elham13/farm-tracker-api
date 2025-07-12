import isProtected from "@/common/middleware/isProtected";
import express, { Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import {
  AddOperationsBodySchema,
  GetOperationsByIdSchema,
  GetOperationsSchema,
} from "./operationsModel";
import { operationsController } from "./operationsController";

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
  );

operationsRouter.get(
  "/:id",
  isProtected,
  validateRequest(GetOperationsByIdSchema),
  operationsController.getOperationById
);
