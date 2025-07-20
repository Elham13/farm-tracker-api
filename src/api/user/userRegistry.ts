import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, UpdateUserSchema, UserSchema } from "./userModel";

export const userRegistry = new OpenAPIRegistry();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});
userRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});
userRegistry.registerPath({
  method: "put",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": { schema: UpdateUserSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(UserSchema, "Success"),
});
