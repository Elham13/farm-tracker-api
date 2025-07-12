import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "@/api/user/userModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterBodySchema,
  RegisterResponseSchema,
} from "./authModel";

export const authRegistry = new OpenAPIRegistry();

authRegistry.register("Auth", UserSchema);

authRegistry.registerPath({
  method: "post",
  path: "/login",
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
  path: "/register",
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
