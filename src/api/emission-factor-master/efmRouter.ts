import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { efmController } from "./efmController";
import { AddEFMBodySchema, GetEFMByIdSchema } from "./efmModel";

export const efmRouter: Router = express.Router();

efmRouter
  .route("/")
  .get(isProtected, efmController.getEFM)
  .post(isProtected, validateRequest(AddEFMBodySchema), efmController.addEFM);

efmRouter.get(
  "/:id",
  isProtected,
  validateRequest(GetEFMByIdSchema),
  efmController.getEFMById
);
