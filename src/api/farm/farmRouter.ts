import isProtected from "@/common/middleware/isProtected";
import express, { Router } from "express";
import { farmController } from "./farmController";
import { validateRequest } from "@/common/utils/httpHandlers";
import { AddFarmBodySchema, GetFarmByIdFarmSchema } from "./farmModel";

export const farmRouter: Router = express.Router();

farmRouter
  .route("/")
  .get(isProtected, farmController.getFarms)
  .post(
    isProtected,
    validateRequest(AddFarmBodySchema),
    farmController.addFarm
  );

farmRouter.get(
  "/:id",
  isProtected,
  validateRequest(GetFarmByIdFarmSchema),
  farmController.getFarmById
);
