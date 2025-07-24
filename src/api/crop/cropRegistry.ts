import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  AddCropSchema,
  CropSchema,
  GetCropByIdSchema,
  GetCropResponseSchema,
  GetCropsSchema,
  UpdateCropSchema,
} from "./cropModel";

export const cropRegistry = new OpenAPIRegistry();

cropRegistry.register("Crop", CropSchema);

cropRegistry.registerPath({
  method: "get",
  path: "/crops",
  tags: ["Crop"],
  request: {
    query: GetCropsSchema.shape.query,
  },
  responses: createApiResponse(z.array(CropSchema), "Success"),
});
cropRegistry.registerPath({
  method: "get",
  path: "/crops/{id}",
  tags: ["Crop"],
  request: {
    params: GetCropByIdSchema.shape.params,
  },
  responses: createApiResponse(GetCropResponseSchema, "Success"),
});
cropRegistry.registerPath({
  method: "delete",
  path: "/crops/{id}",
  tags: ["Crop"],
  request: {
    params: GetCropByIdSchema.shape.params,
  },
  responses: createApiResponse(CropSchema, "Success"),
});

cropRegistry.registerPath({
  method: "post",
  path: "/crops",
  tags: ["Crop"],
  request: {
    body: {
      content: {
        "application/json": { schema: AddCropSchema },
      },
    },
  },
  responses: createApiResponse(CropSchema, "Success"),
});

cropRegistry.registerPath({
  method: "put",
  path: "/crops",
  tags: ["Crop"],
  request: {
    body: {
      content: {
        "application/json": { schema: UpdateCropSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CropSchema, "Success"),
});
