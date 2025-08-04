import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { farmController } from "./farmController";
import {
  AddFarmBodySchema,
  GetFarmByIdSchema,
  GetFarmsSchema,
  UpdateFarmBodySchema,
} from "./farmModel";

export const farmRouter: Router = express.Router();

farmRouter
  .route("/")
  .get(isProtected, validateRequest(GetFarmsSchema), farmController.getFarms)
  .post(isProtected, validateRequest(AddFarmBodySchema), farmController.addFarm)
  .put(
    isProtected,
    validateRequest(UpdateFarmBodySchema),
    farmController.updateFarm
  );

farmRouter
  .route("/:id")
  .get(
    isProtected,
    validateRequest(GetFarmByIdSchema),
    farmController.getFarmById
  )
  .delete(
    isProtected,
    validateRequest(GetFarmByIdSchema),
    farmController.deleteFarm
  );
