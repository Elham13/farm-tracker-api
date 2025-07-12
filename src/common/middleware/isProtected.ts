import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../db/models/user";
import { env } from "../utils/envConfig";
import type { EnhancedRequest, UserInReq } from "../utils/type";
import { asyncHandler } from "./asyncHandler";
import { ErrorHandler } from "./errorHandler";

const isProtected = asyncHandler(
  async (req: EnhancedRequest, _res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization as string;
      if (!authorization)
        return next(
          new ErrorHandler("Token not found!", StatusCodes.UNAUTHORIZED)
        );

      const token = authorization.split(" ")[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as UserInReq;

      if (!decoded)
        return next(
          new ErrorHandler("Failed to verify token!", StatusCodes.UNAUTHORIZED)
        );

      const user = await User.findById(decoded.userId);

      if (!user)
        return next(
          new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED)
        );

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError)
        return next(
          new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED)
        );

      if (error instanceof jwt.TokenExpiredError)
        return next(
          new ErrorHandler("Token expired", StatusCodes.UNAUTHORIZED)
        );

      return next(
        new ErrorHandler(
          "Authentication failed",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);

export default isProtected;
