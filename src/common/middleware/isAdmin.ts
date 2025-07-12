import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Role } from "../utils/constants/enums";
import type { EnhancedRequest } from "../utils/type";
import { asyncHandler } from "./asyncHandler";
import { ErrorHandler } from "./errorHandler";

const isAdmin = asyncHandler(
  async (req: EnhancedRequest, _res: Response, next: NextFunction) => {
    if (req.user && req.user?.role === Role.ADMIN) {
      next();
    } else
      return next(
        new ErrorHandler(
          "Access denied! only admin is authorized for this action",
          StatusCodes.FORBIDDEN
        )
      );
  }
);

export default isAdmin;
