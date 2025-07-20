import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  AddFarmSchema,
  FarmSchema,
  GetFarmByIdSchema,
  UpdateFarmSchema,
} from "./farmModel";

export const farmRegistry = new OpenAPIRegistry();

farmRegistry.register("Farm", FarmSchema);

farmRegistry.registerPath({
  method: "get",
  path: "/farms",
  tags: ["Farm"],
  responses: createApiResponse(z.array(FarmSchema), "Success"),
});
farmRegistry.registerPath({
  method: "get",
  path: "/farms/{id}",
  tags: ["Farm"],
  request: {
    params: GetFarmByIdSchema.shape.params,
  },
  responses: createApiResponse(FarmSchema, "Success"),
});

farmRegistry.registerPath({
  method: "delete",
  path: "/farms/{id}",
  tags: ["Farm"],
  request: {
    params: GetFarmByIdSchema.shape.params,
  },
  responses: createApiResponse(FarmSchema, "Success"),
});

farmRegistry.registerPath({
  method: "post",
  path: "/farms",
  tags: ["Farm"],
  request: {
    body: {
      content: {
        "application/json": { schema: AddFarmSchema.omit({ user: true }) },
      },
    },
  },
  responses: createApiResponse(FarmSchema, "Success"),
});

farmRegistry.registerPath({
  method: "put",
  path: "/farms",
  tags: ["Farm"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateFarmSchema,
        },
      },
    },
  },
  responses: createApiResponse(FarmSchema, "Success"),
});
