import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { cropController } from "./cropController";
import {
  AddCropBodySchema,
  GetCropByIdSchema,
  GetCropsSchema,
  UpdateCropSchema,
} from "./cropModel";

export const cropRouter: Router = express.Router();

cropRouter
  .route("/")
  .get(isProtected, validateRequest(GetCropsSchema), cropController.getCrops)
  .post(isProtected, validateRequest(AddCropBodySchema), cropController.addCrop)
  .put(
    isProtected,
    validateRequest(UpdateCropSchema),
    cropController.updateCrop
  );

cropRouter
  .route("/:id")
  .get(
    isProtected,
    validateRequest(GetCropByIdSchema),
    cropController.getCropById
  )
  .delete(
    isProtected,
    validateRequest(GetCropByIdSchema),
    cropController.deleteCrop
  );
