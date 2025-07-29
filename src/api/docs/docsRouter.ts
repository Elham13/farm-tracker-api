import express, { type Router } from "express";
import isProtected from "@/common/middleware/isProtected";
import { validateRequest } from "@/common/utils/httpHandlers";
import { docsController } from "./docsController";
import {
  AddDocsBodySchema,
  GetDocByIdSchema,
  GetDocsSchema,
  UpdateDocBodySchema,
} from "./docsModel";

export const docsRouter: Router = express.Router();

docsRouter
  .route("/")
  .get(isProtected, validateRequest(GetDocsSchema), docsController.getDocs)
  .post(isProtected, validateRequest(AddDocsBodySchema), docsController.addDoc)
  .put(
    isProtected,
    validateRequest(UpdateDocBodySchema),
    docsController.updateDoc
  );

docsRouter
  .route("/:id")
  .get(
    isProtected,
    validateRequest(GetDocByIdSchema),
    docsController.getDocById
  )
  .delete(
    isProtected,
    validateRequest(GetDocByIdSchema),
    docsController.deleteDoc
  );
