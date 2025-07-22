import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
} from "mongoose";
import type { TOperationsMaster } from "@/api/operations-master/operationsMasterModel";

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
  },
  { timestamps: true }
);

const OperationsMaster: Model<IOperationsMaster> =
  mongoose.models.OperationsMaster ||
  mongoose.model<IOperationsMaster>("OperationsMaster", OperationsMasterSchema);

export default OperationsMaster;
