import z from "zod";

export const GetAllEmissionsQuery = z.object({
  query: z.object({ category: z.string().optional() }),
});

export type TGetAllEmissionsQuery = z.infer<
  typeof GetAllEmissionsQuery.shape.query
>;
