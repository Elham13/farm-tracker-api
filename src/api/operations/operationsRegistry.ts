import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import z from "zod";
import {
  AddOperationsSchema,
  GetOperationsByIdSchema,
  GetOperationsSchema,
  OperationsSchema,
} from "./operationsModel";

export const operationsRegistry = new OpenAPIRegistry();

operationsRegistry.register("Operations", OperationsSchema);

operationsRegistry.registerPath({
  method: "get",
  path: "/operations",
  tags: ["Operations "],
  request: {
    query: GetOperationsSchema.shape.query,
  },
  responses: createApiResponse(z.array(OperationsSchema), "Success"),
});
operationsRegistry.registerPath({
  method: "get",
  path: "/operations/{id}",
  tags: ["Operations "],
  request: {
    params: GetOperationsByIdSchema.shape.params,
    query: GetOperationsByIdSchema.shape.query,
  },
  responses: createApiResponse(OperationsSchema, "Success"),
});

operationsRegistry.registerPath({
  method: "post",
  path: "/operations",
  tags: ["Operations "],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddOperationsSchema,
        },
      },
    },
  },
  responses: createApiResponse(OperationsSchema, "Success"),
});
