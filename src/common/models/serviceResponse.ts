import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

extendZodWithOpenApi(z);

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly statusCode: number;
  readonly timestamp: number;

  private constructor(
    success: boolean,
    message: string,
    data: T,
    statusCode: number
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = dayjs().unix();
  }

  static success<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK
  ) {
    return new ServiceResponse(true, message, data, statusCode);
  }

  static failure<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    return new ServiceResponse(false, message, data, statusCode);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z
    .object({
      timestamp: z.number(),
      success: z.boolean(),
      message: z.string(),
      data: dataSchema.optional(),
      statusCode: z.number(),
    })
    .openapi("ServiceResponse");
