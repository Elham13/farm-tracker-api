import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  AddDocsSchema,
  DocsSchema,
  GetDocByIdSchema,
  UpdateDocSchema,
} from "./docsModel";

export const docsRegistry = new OpenAPIRegistry();

docsRegistry.register("Docs", DocsSchema);

docsRegistry.registerPath({
  method: "get",
  path: "/docs",
  tags: ["Docs"],
  responses: createApiResponse(z.array(DocsSchema), "Success"),
});
docsRegistry.registerPath({
  method: "get",
  path: "/docs/{id}",
  tags: ["Docs"],
  request: {
    params: GetDocByIdSchema.shape.params,
  },
  responses: createApiResponse(DocsSchema, "Success"),
});

docsRegistry.registerPath({
  method: "delete",
  path: "/docs/{id}",
  tags: ["Docs"],
  request: {
    params: GetDocByIdSchema.shape.params,
  },
  responses: createApiResponse(DocsSchema, "Success"),
});

docsRegistry.registerPath({
  method: "post",
  path: "/docs",
  tags: ["Docs"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddDocsSchema,
        },
      },
    },
  },
  responses: createApiResponse(DocsSchema, "Success"),
});

docsRegistry.registerPath({
  method: "put",
  path: "/docs",
  tags: ["Docs"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateDocSchema,
        },
      },
    },
  },
  responses: createApiResponse(DocsSchema, "Success"),
});
