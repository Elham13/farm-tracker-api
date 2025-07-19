import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
} from "mongoose";
import type { TEFM } from "@/api/emission-factor-master/efmModel";

interface IEFMSchema extends Document, Omit<TEFM, "_id"> {
  _id: ObjectId;
}

const EFMSchema = new Schema<IEFMSchema>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    units: {
      type: [String],
      required: true,
    },
    unitMapping: { type: Object },
    per_unit_carbon_emission: { type: String, required: true },
  },
  { timestamps: true }
);

const EmissionFactorMaster: Model<IEFMSchema> =
  mongoose.models.EmissionFactorMaster ||
  mongoose.model<IEFMSchema>("EmissionFactorMaster", EFMSchema);

export default EmissionFactorMaster;
