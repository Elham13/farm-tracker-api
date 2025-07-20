import express, { type Router } from "express";
import isAdmin from "@/common/middleware/isAdmin";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { efController } from "./efController";
import {
  AddEFBodySchema,
  GetEFByIdSchema,
  UpdateEFBodySchema,
} from "./efModel";

export const efRouter: Router = express.Router();

efRouter
  .route("/")
  .get(isProtected, efController.getEF)
  .post(isProtected, validateRequest(AddEFBodySchema), efController.addEF)
  .put(
    isProtected,
    isAdmin,
    validateRequest(UpdateEFBodySchema),
    efController.updateEF
  );

efRouter
  .route("/:id")
  .get(isProtected, validateRequest(GetEFByIdSchema), efController.getEFById)
  .delete(
    isProtected,
    isAdmin,
    validateRequest(GetEFByIdSchema),
    efController.deleteEF
  );
