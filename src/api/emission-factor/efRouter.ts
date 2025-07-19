import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { efController } from "./efController";
import { AddEFBodySchema, GetEFByIdSchema } from "./efModel";

export const efRouter: Router = express.Router();

efRouter
  .route("/")
  .get(isProtected, efController.getEF)
  .post(isProtected, validateRequest(AddEFBodySchema), efController.addEF);

efRouter.get(
  "/:id",
  isProtected,
  validateRequest(GetEFByIdSchema),
  efController.getEFById
);
