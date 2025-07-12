import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "@/api/user/userModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { LoginResponseSchema } from "./authModel";

export const authRegistry = new OpenAPIRegistry();

authRegistry.register("Auth", UserSchema);

authRegistry.registerPath({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  responses: createApiResponse(LoginResponseSchema, "Success"),
});
