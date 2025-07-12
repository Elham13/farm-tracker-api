import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const FarmSchema = z
  .object({
    _id: commonValidations.id,
    name: z.string(),
    size: z.string(),
    address: z.string(),
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
      size: "3 acres",
      address: "Delhi",
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

export type TFarm = z.infer<typeof FarmSchema>;
export type TAddFarm = z.infer<typeof AddFarmSchema>;
