import { TOperations } from "@/api/operations/operationsModel";
import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";

interface IOperationsSchema
  extends Document,
    Omit<TOperations, "_id" | "operationMaster"> {
  _id: ObjectId;
  operationMaster: ObjectId;
}

const OperationsSchema = new Schema<IOperationsSchema>(
  {
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    mode: {
      type: String,
      required: true,
    },
    operationMaster: {
      type: Types.ObjectId,
      ref: "OperationsMaster",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    proof: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Operations: Model<IOperationsSchema> =
  mongoose.models.Operations ||
  mongoose.model<IOperationsSchema>("Operations", OperationsSchema);

export default Operations;
