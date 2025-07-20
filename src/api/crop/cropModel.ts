import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";
import { CropType } from "@/common/utils/constants/enums";

extendZodWithOpenApi(z);

export const CropSchema = z
  .object({
    _id: commonValidations.id,
    name: z.string(),
    type: z.nativeEnum(CropType, {
      errorMap: () => ({
        message: `Type must be either ${CropType.CURRENT} or ${CropType.PREVIOUS}`,
      }),
    }),
    icon: z.string().optional(),
    farm: commonValidations.id,
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
      type: "Current",
      icon: "https://example.com/1.png",
      farm: "686f9e8a07c77bc9afcdd542",
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

export type TCrop = z.infer<typeof CropSchema>;
export type TAddCrop = z.infer<typeof AddCropSchema>;
export type TGetCropByIdInput = {
  id: string;
};
export type TUpdateCropInput = z.infer<typeof UpdateCropSchema.shape.body>;
