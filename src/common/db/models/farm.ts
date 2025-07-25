import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";
import type { TFarm } from "@/api/farm/farmModel";

interface IFarmSchema extends Document, Omit<TFarm, "_id" | "user"> {
  _id: ObjectId;
  user: ObjectId;
}

const FarmSchema = new Schema<IFarmSchema>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    size: {
      type: Number,
      required: [true, "size is required"],
    },
    sizeUnit: {
      type: String,
      required: [true, "sizeUnit is required"],
    },
    address: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    geo: {
      type: {
        lat: Number,
        long: Number,
      },
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Farm: Model<IFarmSchema> =
  mongoose.models.Farm || mongoose.model<IFarmSchema>("Farm", FarmSchema);

export default Farm;
