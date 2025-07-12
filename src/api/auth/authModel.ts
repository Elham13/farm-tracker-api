import z from "zod";
import { UserSchema } from "../user/userModel";

export const LoginSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .length(10, "Phone number must be exactly 10 digits")
      .regex(/^\d+$/, "Phone must be numeric"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const LoginResponseSchema = UserSchema.extend({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
