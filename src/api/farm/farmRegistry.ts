import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { AddFarmSchema, FarmSchema, GetFarmByIdSchema } from "./farmModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import z from "zod";

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
