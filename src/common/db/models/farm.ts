import { TFarm } from "@/api/farm/farmModel";
import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";

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
      type: String,
      required: [true, "size is required"],
    },
    address: {
      type: String,
      required: [true, "email is required"],
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
