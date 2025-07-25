import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const OperationsMasterSchema = z
  .object({
    _id: commonValidations.id,
    label: z.string(),
    icon: z.string().optional(),
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
  body: AddOperationsMasterSchema,
});

export const GetOperationsMasterByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const UpdateOperationsMasterSchema = OperationsMasterSchema.pick({
  _id: true,
}).merge(
  OperationsMasterSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  }).partial()
);

export const UpdateOperationsMasterBodySchema = z.object({
  body: UpdateOperationsMasterSchema,
});

export type TOperationsMaster = z.infer<typeof OperationsMasterSchema>;
export type TAddOperationsMaster = z.infer<typeof AddOperationsMasterSchema>;
export type TGetOperationsMasterByIdInput = {
  id: string;
};
export type TUpdateOperationsMasterInput = z.infer<
  typeof UpdateOperationsMasterSchema
>;
