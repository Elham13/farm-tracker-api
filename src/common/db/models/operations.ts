import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";
import type { TOperations } from "@/api/operations/operationsModel";

interface IOperationsSchema
  extends Document,
    Omit<TOperations, "_id" | "operationMaster" | "cropId"> {
  _id: ObjectId;
  operationMaster: ObjectId;
  cropId: ObjectId;
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
    cropId: {
      type: Types.ObjectId,
      ref: "Crop",
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
