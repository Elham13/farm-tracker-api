import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const FarmSchema = z
  .object({
    _id: commonValidations.id,
    name: z.string(),
    size: z.number(),
    sizeUnit: z.string(),
    address: z.string(),
    pinCode: z.number(),
    user: commonValidations.id,
    geo: z.object({ lat: z.number(), long: z.number() }).optional(),
    createdAt: z.string().transform((date) => new Date(date)),
    updatedAt: z.string().transform((date) => new Date(date)),
  })
  .openapi({
    title: "Farm",
    description: "Farm model",
    type: "object",
    example: {
      _id: "686f9e8a07c77bc9afcdd546",
      name: "Test Farm",
      size: 2,
      sizeUnit: "acres",
      address: "Delhi",
      pinCode: 110014,
      user: "686f9e8a07c77bc9afcdd543",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
  });

export const AddFarmSchema = FarmSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const AddFarmBodySchema = z.object({
  body: FarmSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
    user: true,
  }),
});

export const GetFarmByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const UpdateFarmSchema = FarmSchema.pick({ _id: true }).merge(
  FarmSchema.omit({ _id: true, createdAt: true, updatedAt: true }).partial()
);

export const UpdateFarmBodySchema = z.object({
  body: UpdateFarmSchema,
});

export type TFarm = z.infer<typeof FarmSchema>;
export type TAddFarm = z.infer<typeof AddFarmSchema>;
export type TUpdateFarmInput = z.infer<typeof UpdateFarmSchema>;
