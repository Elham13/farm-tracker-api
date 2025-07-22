import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  AddOperationsMasterSchema,
  GetOperationsMasterByIdSchema,
  OperationsMasterSchema,
  UpdateOperationsMasterSchema,
} from "./operationsMasterModel";

export const operationsMasterRegistry = new OpenAPIRegistry();

operationsMasterRegistry.register("Operations Master", OperationsMasterSchema);

operationsMasterRegistry.registerPath({
  method: "get",
  path: "/operations-master",
  tags: ["Operations Master"],
  responses: createApiResponse(z.array(OperationsMasterSchema), "Success"),
});
operationsMasterRegistry.registerPath({
  method: "get",
  path: "/operations-master/{id}",
  tags: ["Operations Master"],
  request: {
    params: GetOperationsMasterByIdSchema.shape.params,
  },
  responses: createApiResponse(OperationsMasterSchema, "Success"),
});

operationsMasterRegistry.registerPath({
  method: "delete",
  path: "/operations-master/{id}",
  tags: ["Operations Master"],
  request: {
    params: GetOperationsMasterByIdSchema.shape.params,
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

operationsMasterRegistry.registerPath({
  method: "put",
  path: "/operations-master",
  tags: ["Operations Master"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateOperationsMasterSchema,
        },
      },
    },
  },
  responses: createApiResponse(OperationsMasterSchema, "Success"),
});
