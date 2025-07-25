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
    name: { type: String },
    motorCapacityInHP: { type: Number },
    energySource: { type: String },
    areaCovered: { type: Number, required: true },
    areaCoveredUnit: { type: String, required: true },
    mode: {
      type: String,
      required: true,
    },
    tractorOwnership: { type: String },
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
    quantityToday: {
      type: Number,
    },
    quantityUnit: {
      type: String,
    },
    durationToday: {
      type: Number,
      required: true,
    },
    durationTodayUnit: {
      type: String,
      required: true,
    },
    proof: {
      type: String,
    },
    documentName: {
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
