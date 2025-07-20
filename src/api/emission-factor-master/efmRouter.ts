import express, { type Router } from "express";
import isAdmin from "@/common/middleware/isAdmin";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { efmController } from "./efmController";
import {
  AddEFMBodySchema,
  GetEFMByIdSchema,
  UpdateEFMBodySchema,
} from "./efmModel";

export const efmRouter: Router = express.Router();

efmRouter
  .route("/")
  .get(isProtected, efmController.getEFM)
  .post(isProtected, validateRequest(AddEFMBodySchema), efmController.addEFM)
  .put(
    isProtected,
    isAdmin,
    validateRequest(UpdateEFMBodySchema),
    efmController.updateEF
  );

efmRouter
  .route("/:id")
  .get(isProtected, validateRequest(GetEFMByIdSchema), efmController.getEFMById)
  .delete(
    isProtected,
    isAdmin,
    validateRequest(GetEFMByIdSchema),
    efmController.deleteEFM
  );
