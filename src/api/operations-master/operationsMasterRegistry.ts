import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import z from "zod";
import {
  AddOperationsMasterSchema,
  GetOperationsMasterByIdSchema,
  GetOperationsMastersSchema,
  OperationsMasterSchema,
} from "./operationsMasterModel";

export const operationsMasterRegistry = new OpenAPIRegistry();

operationsMasterRegistry.register("Operations Master", OperationsMasterSchema);

operationsMasterRegistry.registerPath({
  method: "get",
  path: "/operations-master",
  tags: ["Operations Master"],
  request: {
    query: GetOperationsMastersSchema.shape.query,
  },
  responses: createApiResponse(z.array(OperationsMasterSchema), "Success"),
});
operationsMasterRegistry.registerPath({
  method: "get",
  path: "/operations-master/{id}",
  tags: ["Operations Master"],
  request: {
    params: GetOperationsMasterByIdSchema.shape.params,
    query: GetOperationsMasterByIdSchema.shape.query,
  },
  responses: createApiResponse(OperationsMasterSchema, "Success"),
});

operationsMasterRegistry.registerPath({
  method: "post",
  path: "/operations-master",
  tags: ["Operations Master"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddOperationsMasterSchema,
        },
      },
    },
  },
  responses: createApiResponse(OperationsMasterSchema, "Success"),
});
