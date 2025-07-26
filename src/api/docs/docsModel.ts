import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const DocsSchema = z
  .object({
    _id: commonValidations.id,
    cropId: commonValidations.id,
    masterId: commonValidations.id,
    docUri: z.string().optional(),
    docName: z.string(),
    createdAt: z.string().transform((date) => new Date(date)),
    updatedAt: z.string().transform((date) => new Date(date)),
  })
  .openapi({
    title: "Docs",
    description: "Docs model",
    type: "object",
    example: {
      _id: "686f9e8a07c77bc2afcdd536",
      cropId: "186f9e8a07c77bc2afcdd536",
      masterId: "18wf9e8a07c77bc2afcdd536",
      docUri: "data:image/png;base64,kjsdfkj",
      docName: "pesticide-invoice",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
  });

export const GetDocsSchema = z.object({
  query: z.object({
    masterId: commonValidations.id,
    cropId: commonValidations.id,
  }),
});

export const AddDocsSchema = DocsSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const AddDocsBodySchema = z.object({
  body: AddDocsSchema,
});

export const GetDocByIdSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const UpdateDocSchema = DocsSchema.pick({
  _id: true,
}).merge(
  DocsSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
  }).partial()
);

export const UpdateDocBodySchema = z.object({
  body: UpdateDocSchema,
});

export type TDoc = z.infer<typeof DocsSchema>;
export type TGetDocsInput = z.infer<typeof GetDocsSchema.shape.query>;
export type TAddDoc = z.infer<typeof AddDocsSchema>;
export type TGetDocByIdInput = {
  id: string;
};
export type TUpdateDocInput = z.infer<typeof UpdateDocSchema>;
