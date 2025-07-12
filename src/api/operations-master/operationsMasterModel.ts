import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const OperationsMasterSchema = z
  .object({
    _id: commonValidations.id,
    label: z.string(),
    icon: z.string().optional(),
    user: commonValidations.id,
    crop: commonValidations.id,
    createdAt: z.string().transform((date) => new Date(date)),
    updatedAt: z.string().transform((date) => new Date(date)),
  })
  .openapi({
    title: "Operations Master",
    description: "Operations Master model",
    type: "object",
    example: {
      _id: "686f9e8a07c77bc9afcdd536",
      label: "Fertilizer",
      icon: "https://example.com/1.png",
      user: "686f9e8a07c77bc9afcdd543",
      crop: "686f9e8a07c77bc9afcdd542",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
  });

export const AddOperationsMasterSchema = OperationsMasterSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const AddOperationsMasterBodySchema = z.object({
  body: OperationsMasterSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
    user: true,
  }),
});

export const GetOperationsMasterByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  query: z.object({ cropId: commonValidations.id }),
});

export const GetOperationsMastersSchema = z.object({
  query: z.object({ cropId: commonValidations.id }),
});

export type TOperationsMaster = z.infer<typeof OperationsMasterSchema>;
export type TAddOperationsMaster = z.infer<typeof AddOperationsMasterSchema>;
export type TGetOperationsMasterByIdInput = {
  id: string;
  userId: string;
  cropId: string;
};
