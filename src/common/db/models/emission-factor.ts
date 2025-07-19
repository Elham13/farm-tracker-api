import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";
import type { TEF } from "@/api/emission-factor/efModel";

interface IEFSchema
  extends Document,
    Omit<TEF, "_id" | "emission_factor_master"> {
  _id: ObjectId;
  emission_factor_master: ObjectId;
}

const EFMSchema = new Schema<IEFSchema>(
  {
    mode: {
      type: String,
      required: [true, "mode is required"],
    },
    operation: {
      type: String,
      required: [true, "operation is required"],
    },
    emission_factor_master: {
      type: Types.ObjectId,
      ref: "EmissionFactorMaster",
      required: true,
    },
    value: { type: Number, required: true },
    value_unit: { type: String, required: true },
    duration: { type: Number, required: true },
    duration_unit: { type: String, required: true },
  },
  { timestamps: true }
);

const EmissionFactor: Model<IEFSchema> =
  mongoose.models.EmissionFactor ||
  mongoose.model<IEFSchema>("EmissionFactor", EFMSchema);

export default EmissionFactor;
