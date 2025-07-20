import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const EFMSchema = z
  .object({
    _id: commonValidations.id,
    name: z.string(),
    category: z.string(),
    units: z.array(z.string()),
    unitMapping: z.object({}),
    per_unit_carbon_emission: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .openapi({
    title: "Emission Factor Master",
    description: "Emission Factor Master model",
    type: "object",
    example: {
      _id: "686f9e8a07c77bc9adcdd536",
      name: "Electricity",
      category: "Material Consumption",
      units: ["w/hr", "kw/hr", "mw/h"],
      unitMapping: {
        "1kw": "1000w",
        "1mw": "1000kw",
      },
      per_unit_carbon_emission: "12kg",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

export const AddEFMSchema = EFMSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const AddEFMBodySchema = z.object({
  body: AddEFMSchema,
});

export const UpdateEFMSchema = EFMSchema.pick({ _id: true }).merge(
  EFMSchema.omit({ _id: true, createdAt: true, updatedAt: true }).partial()
);

export const UpdateEFMBodySchema = z.object({
  body: UpdateEFMSchema,
});

export const GetEFMByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export type TEFM = z.infer<typeof EFMSchema>;
export type TAddEFM = z.infer<typeof AddEFMSchema>;
export type TGetEFMByIdInput = {
  id: string;
};
export type TUpdateEFMInput = z.infer<typeof UpdateEFMSchema>;
