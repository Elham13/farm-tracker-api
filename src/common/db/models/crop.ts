import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";
import type { TCrop } from "@/api/crop/cropModel";
import { CropType } from "@/common/utils/constants/enums";

interface ICropSchema extends Document, Omit<TCrop, "_id" | "userId" | "farm"> {
  _id: ObjectId;
  userId: ObjectId;
  farm: ObjectId;
}

const CropSchema = new Schema<ICropSchema>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    variety: {
      type: String,
    },
    cropStatus: {
      type: String,
      default: "Active",
    },
    type: {
      type: String,
      enum: {
        values: [CropType.CURRENT, CropType.PREVIOUS],
        message: `Please provide one of the following values:=> ${CropType.CURRENT}, ${CropType.PREVIOUS}`,
      },
      required: [true, "type is required"],
    },
    areaUnderCultivation: {
      type: Number,
      required: true,
    },
    dateOfSowing: {
      type: Date,
      required: true,
    },
    dateOfHarvest: {
      type: Date,
    },
    farm: {
      type: Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Crop: Model<ICropSchema> =
  mongoose.models.Crop || mongoose.model<ICropSchema>("Crop", CropSchema);

export default Crop;
