import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

healthCheckRegistry.registerPath({
  method: "get",
  path: "/health-check",
  tags: ["Health Check"],
  responses: createApiResponse(z.null(), "Success"),
});

healthCheckRouter.get("/", (_req: Request, res: Response) => {
  if (_req.query) throw new ErrorHandler("fuck", StatusCodes.UNAUTHORIZED);
  const serviceResponse = ServiceResponse.success("Service is healthy", null);
  res.status(serviceResponse.statusCode).send(serviceResponse);
});
