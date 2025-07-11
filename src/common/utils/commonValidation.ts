import { Types } from "mongoose";
import { z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .refine((value) => Types.ObjectId.isValid(value), "Invalid ID format"),
  // ... other common validations
};
