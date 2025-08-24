import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { Role } from "@/common/utils/constants/enums";

extendZodWithOpenApi(z);

export const UserSchema = z
  .object({
    _id: commonValidations.id,
    name: z.string(),
    phone: z
      .string()
      .length(10, "Phone number must be exactly 10 digits")
      .regex(/^\d+$/, "Phone must be numeric"),
    password: z.string().min(4, "PIN must be 4 digits"),
    role: z.nativeEnum(Role, {
      errorMap: () => ({
        message: `Role must be either ${Role.ADMIN} or ${Role.FARMER}`,
      }),
    }),
    createdAt: z.string().transform((date) => new Date(date)),
    updatedAt: z.string().transform((date) => new Date(date)),
  })
  .openapi({
    type: "object",
    description: "User model",
    title: "User",
    example: {
      _id: "686f9e8a07c77bc9afcdd546",
      name: "John Doe",
      phone: "9838838283",
      password: "abc123",
      role: Role.ADMIN,
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
  });

export type TUser = z.infer<typeof UserSchema>;

export const GetUsersQuerySchema = z.object({
  role: UserSchema.shape.role.optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().regex(/^\d+$/, "Page must be numeric").optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be numeric").optional(),
});

export type TGetUserQuery = z.infer<typeof GetUsersQuerySchema>;

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const CreateUserSchema = z.object({
  body: UserSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  }).openapi({
    description: "Schema for creating a new user",
    title: "CreateUser",
  }),
});

export const UpdateUserSchema = z
  .object({
    body: UserSchema.pick({ _id: true }).merge(
      UserSchema.omit({
        _id: true,
        createdAt: true,
        updatedAt: true,
      }).partial()
    ),
  })
  .openapi({
    description: "Schema for updating an existing user",
    title: "UpdateUser",
  });

export type TUpdateUser = z.infer<typeof UpdateUserSchema.shape.body>;

// Pagination response schema
export const PaginatedUsersResponseSchema = z.object({
  content: z.array(UserSchema.omit({ password: true })),
  total: z.number(),
});

export type TPaginatedUsersResponse = z.infer<
  typeof PaginatedUsersResponseSchema
>;
