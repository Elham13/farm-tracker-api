import isProtected from "@/common/middleware/isProtected";
import express, { Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { cropController } from "./cropController";
import {
  AddCropBodySchema,
  GetCropByIdSchema,
  GetCropsSchema,
} from "./cropModel";

export const cropRouter: Router = express.Router();

cropRouter
  .route("/")
  .get(isProtected, validateRequest(GetCropsSchema), cropController.getCrops)
  .post(
    isProtected,
    validateRequest(AddCropBodySchema),
    cropController.addCrop
  );

cropRouter.get(
  "/:id",
  isProtected,
  validateRequest(GetCropByIdSchema),
  cropController.getCropById
);
