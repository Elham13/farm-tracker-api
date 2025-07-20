import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "@/api/user/userModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  LoginRequestSchema,
  LoginResponseSchema,
  RefreshRequestSchema,
  RefreshResponseSchema,
  RegisterBodySchema,
  RegisterResponseSchema,
} from "./authModel";

export const authRegistry = new OpenAPIRegistry();

authRegistry.register(
  "Auth",
  UserSchema.openapi({
    title: "Auth",
    description: "Auth model",
  })
);

authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": { schema: LoginRequestSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(LoginResponseSchema, "Success"),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": { schema: RegisterBodySchema },
      },
    },
  },
  responses: createApiResponse(RegisterResponseSchema, "Success"),
});

authRegistry.registerPath({
  method: "post",
  path: "/auth/refresh-token",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": { schema: RefreshRequestSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(RefreshResponseSchema, "Success"),
});
