import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";
import { CropType } from "@/common/utils/constants/enums";
import { FarmSchema } from "../farm/farmModel";

extendZodWithOpenApi(z);

export const CropSchema = z
  .object({
    _id: commonValidations.id,
    name: z.string(),
    variety: z.string().optional(),
    areaUnderCultivation: z.number(),
    type: z.nativeEnum(CropType, {
      errorMap: () => ({
        message: `Type must be either ${CropType.CURRENT} or ${CropType.PREVIOUS}`,
      }),
    }),
    farm: commonValidations.id,
    dateOfSowing: z.string().transform((date) => new Date(date)),
    dateOfHarvest: z
      .string()
      .transform((date) => new Date(date))
      .optional(),
    createdAt: z.string().transform((date) => new Date(date)),
    updatedAt: z.string().transform((date) => new Date(date)),
  })
  .openapi({
    title: "Crop",
    description: "Crop model",
    type: "object",
    example: {
      _id: "686f9e8a07c77bc9afcdd546",
      name: "Corn",
      variety: "Sweet Corn",
      type: "Current",
      areaUnderCultivation: 10,
      farm: "686f9e8a07c77bc9afcdd542",
      dateOfSowing: "2023-10-01T12:00:00Z",
      dateOfHarvest: "2023-10-01T12:00:00Z",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
  });

export const AddCropSchema = CropSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCropSchema = z.object({
  body: CropSchema.pick({ _id: true }).merge(
    CropSchema.omit({
      _id: true,
      createdAt: true,
      updatedAt: true,
    }).partial()
  ),
});

export const AddCropBodySchema = z.object({
  body: AddCropSchema,
});

export const GetCropByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const GetCropsSchema = z.object({
  query: z.object({ farmId: commonValidations.id }),
});

export const GetCropResponseSchema = z
  .object({
    farmObj: FarmSchema,
  })
  .merge(CropSchema);

export type TCrop = z.infer<typeof CropSchema>;
export type TCropExtended = z.infer<typeof GetCropResponseSchema>;
export type TAddCrop = z.infer<typeof AddCropSchema>;
export type TGetCropByIdInput = {
  id: string;
};
export type TUpdateCropInput = z.infer<typeof UpdateCropSchema.shape.body>;
