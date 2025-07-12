import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const OperationsSchema = z
  .object({
    _id: commonValidations.id,
    operationMaster: commonValidations.id,
    date: z.string().transform((date) => new Date(date)),
    mode: z.string(),
    quantity: z.number(),
    unit: z.string(),
    duration: z.string(),
    proof: z.string().optional(),
    description: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .openapi({
    title: "Operations",
    description: "Operations model",
    type: "object",
    example: {
      _id: "686f9e8a07c77bc9adcdd536",
      operationMaster: "686f9e8a07c77bc9adcdd539",
      date: "2025-07-13T00:00:00Z",
      mode: "Chemical",
      quantity: 2,
      unit: "KG",
      duration: "4 days",
      proof: "https://example.com/proof.png",
      description: "Fertilizer",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

export const AddOperationsSchema = OperationsSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const AddOperationsBodySchema = z.object({
  body: AddOperationsSchema,
});

export const GetOperationsByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  query: z.object({ masterId: commonValidations.id }),
});

export const GetOperationsSchema = z.object({
  query: z.object({ masterId: commonValidations.id }),
});

export type TOperations = z.infer<typeof OperationsSchema>;
export type TAddOperations = z.infer<typeof AddOperationsSchema>;
export type TGetOperationsByIdInput = {
  id: string;
  masterId: string;
};
