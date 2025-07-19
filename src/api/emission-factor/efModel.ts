import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const EFSchema = z
  .object({
    _id: commonValidations.id,
    mode: z.string(),
    operation: z.string(),
    emission_factor_master: commonValidations.id,
    value: z.number(),
    value_unit: z.string(),
    duration: z.number(),
    duration_unit: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .openapi({
    title: "Emission Factor",
    description: "Emission Factor model",
    type: "object",
    example: {
      _id: "686f9e8a07c77bc9adcdd516",
      mode: "Mechanical",
      operation: "Plowing",
      emission_factor_master: "686f9e8a07c77bc9adcdd517",
      value: 3000,
      value_unit: "gm",
      duration: 60,
      duration_unit: "hr",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

export const AddEFSchema = EFSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const AddEFBodySchema = z.object({
  body: AddEFSchema,
});

export const GetEFByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export type TEF = z.infer<typeof EFSchema>;
export type TAddEF = z.infer<typeof AddEFSchema>;
export type TGetEFByIdInput = {
  id: string;
};
