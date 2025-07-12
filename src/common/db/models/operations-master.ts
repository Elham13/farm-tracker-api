import { TOperationsMaster } from "@/api/operations-master/operationsMasterModel";
import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";

interface IOperationsMaster
  extends Document,
    Omit<TOperationsMaster, "_id" | "user" | "crop"> {
  _id: ObjectId;
  user: ObjectId;
  crop: ObjectId;
}

const OperationsMasterSchema = new Schema<IOperationsMaster>(
  {
    label: {
      type: String,
      required: [true, "label is required"],
    },
    icon: {
      type: String,
    },
    crop: {
      type: Types.ObjectId,
      ref: "Crop",
      required: true,
    },
  },
  { timestamps: true }
);

const OperationsMaster: Model<IOperationsMaster> =
  mongoose.models.OperationsMaster ||
  mongoose.model<IOperationsMaster>("OperationsMaster", OperationsMasterSchema);

export default OperationsMaster;
