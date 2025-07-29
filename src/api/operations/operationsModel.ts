import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";
import { OperationsMasterSchema } from "../operations-master/operationsMasterModel";

extendZodWithOpenApi(z);

export const OperationsSchema = z
  .object({
    _id: commonValidations.id,
    operationMaster: commonValidations.id,
    cropId: commonValidations.id,
    date: z.string().transform((date) => new Date(date)),
    name: z.string().optional(),
    motorCapacityInHP: z.number().optional(),
    energySource: z.string().optional(),
    areaCovered: z.number(),
    areaCoveredUnit: z.string(),
    mode: z.string(),
    tractorOwnership: z.string().optional(),
    fertilizerType: z.string().optional(),
    quantityToday: z.number().optional(),
    quantityUnit: z.string().optional(),
    durationToday: z.number(),
    durationTodayUnit: z.string(),
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
      cropId: "686f9e8a07c77bc9adcdd529",
      date: "2025-07-13T00:00:00Z",
      areaCovered: 5,
      areaCoveredUnit: "acres",
      mode: "Chemical",
      quantityToday: 2,
      quantityUnit: "KG",
      durationToday: 4,
      durationTodayUnit: "hr",
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
});

export const GetOperationsSchema = z.object({
  query: z.object({
    masterId: commonValidations.id,
    cropId: commonValidations.id,
  }),
});

export const UpdateOperationsSchema = OperationsSchema.pick({
  _id: true,
}).merge(
  OperationsSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  }).partial()
);

export const UpdateOperationsBodySchema = z.object({
  body: UpdateOperationsSchema,
});

export const GetOperationsResponseSchema = z
  .object({
    masterObj: OperationsMasterSchema,
  })
  .merge(OperationsSchema);

export type TOperations = z.infer<typeof OperationsSchema>;
export type TOperationsExtended = z.infer<typeof GetOperationsResponseSchema>;
export type TAddOperations = z.infer<typeof AddOperationsSchema>;
export type TGetOperationsByIdInput = {
  id: string;
};
export type TUpdateOperationsInput = z.infer<typeof UpdateOperationsSchema>;
export type TGetOperationsInput = z.infer<
  typeof GetOperationsSchema.shape.query
>;
