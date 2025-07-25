import z from "zod";
import { UserSchema } from "../user/userModel";

export const LoginRequestSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .length(10, "Phone number must be exactly 10 digits")
      .regex(/^\d+$/, "Phone must be numeric"),
    password: z.string().min(4, "PIN must be 4 digits"),
  }),
});

export const LoginResponseSchema = UserSchema.extend({
  accessToken: z.string(),
  refreshToken: z.string(),
}).omit({
  password: true,
});

export const RegisterResponseSchema = UserSchema.omit({
  password: true,
});

export const RegisterBodySchema = UserSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const RefreshRequestSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const RefreshResponseSchema = z.object({
  newAccessToken: z.string(),
  newRefreshToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type TLoginInput = z.infer<typeof LoginRequestSchema.shape.body>;
export type TRefreshTokenResponse = z.infer<typeof RefreshResponseSchema>;
