import dayjs from "dayjs";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "@/common/utils/envConfig";

export class ErrorHandler extends Error {
  statusCode = 0;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode ?? 500;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFoundRouter = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next(new ErrorHandler("Address not found", StatusCodes.NOT_FOUND));
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  err.message = err?.message ?? "Internal Server Error!";

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Token is invalid, try again.`;
    err = new ErrorHandler(message, StatusCodes.UNAUTHORIZED);
  }

  // JWT Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `Token is expired, try again.`;
    err = new ErrorHandler(message, StatusCodes.UNAUTHORIZED);
  }

  // Mongodb validation error
  if (err.name === "ValidationError") {
    const keyName = err?.errors[Object.keys(err.errors)[0]]?.path;
    const errObj = err.errors[keyName]?.properties;
    err = new ErrorHandler(
      `${errObj?.message}. Field name: ${errObj?.path}`,
      StatusCodes.BAD_REQUEST
    );
  }

  //MongoServerError
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `Field ${field} is already exist, Please enter a unique ${field}`;
    err = new ErrorHandler(message, StatusCodes.BAD_REQUEST);
  }

  res.status(err.statusCode).json({
    timestamp: dayjs().unix(),
    success: false,
    message: err.message,
    statusCode: err.statusCode,
    data: null,
    stack: env.isProduction ? null : err.stack,
  });
};
