import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import z from "zod";
import {
  AddCropSchema,
  CropSchema,
  GetCropByIdSchema,
  GetCropsSchema,
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
    query: GetCropByIdSchema.shape.query,
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
        "application/json": { schema: AddCropSchema.omit({ user: true }) },
      },
    },
  },
  responses: createApiResponse(CropSchema, "Success"),
});
