import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  AddEFSchema,
  EFSchema,
  GetEFByIdSchema,
  UpdateEFSchema,
} from "./efModel";

export const efRegistry = new OpenAPIRegistry();

efRegistry.register("Emission Factor", EFSchema);

efRegistry.registerPath({
  method: "get",
  path: "/emission-factor",
  tags: ["Emission Factor"],
  responses: createApiResponse(z.array(EFSchema), "Success"),
});
efRegistry.registerPath({
  method: "get",
  path: "/emission-factor/{id}",
  tags: ["Emission Factor"],
  request: {
    params: GetEFByIdSchema.shape.params,
  },
  responses: createApiResponse(EFSchema, "Success"),
});
efRegistry.registerPath({
  method: "delete",
  path: "/emission-factor/{id}",
  tags: ["Emission Factor"],
  request: {
    params: GetEFByIdSchema.shape.params,
  },
  responses: createApiResponse(EFSchema, "Success"),
});

efRegistry.registerPath({
  method: "post",
  path: "/emission-factor",
  tags: ["Emission Factor"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddEFSchema,
        },
      },
    },
  },
  responses: createApiResponse(EFSchema, "Success"),
});

efRegistry.registerPath({
  method: "put",
  path: "/emission-factor",
  tags: ["Emission Factor"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateEFSchema,
        },
      },
    },
  },
  responses: createApiResponse(EFSchema, "Success"),
});
