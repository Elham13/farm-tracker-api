import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { AddEFMSchema, EFMSchema, GetEFMByIdSchema } from "./efmModel";

export const efmRegistry = new OpenAPIRegistry();

efmRegistry.register("Emission Factor Master", EFMSchema);

efmRegistry.registerPath({
  method: "get",
  path: "/efm",
  tags: ["Emission Factor Master"],
  responses: createApiResponse(z.array(EFMSchema), "Success"),
});
efmRegistry.registerPath({
  method: "get",
  path: "/efm/{id}",
  tags: ["Emission Factor Master"],
  request: {
    params: GetEFMByIdSchema.shape.params,
  },
  responses: createApiResponse(EFMSchema, "Success"),
});

efmRegistry.registerPath({
  method: "post",
  path: "/efm",
  tags: ["Emission Factor Master"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddEFMSchema,
        },
      },
    },
  },
  responses: createApiResponse(EFMSchema, "Success"),
});
