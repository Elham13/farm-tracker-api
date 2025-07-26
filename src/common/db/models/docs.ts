import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";
import type { TDoc } from "@/api/docs/docsModel";

interface IDocsSchema
  extends Document,
    Omit<TDoc, "_id" | "cropId" | "masterId"> {
  _id: ObjectId;
  cropId: ObjectId;
  masterId: ObjectId;
}

const DocsSchema = new Schema<IDocsSchema>(
  {
    cropId: {
      type: Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    masterId: {
      type: Types.ObjectId,
      ref: "OperationsMaster",
      required: true,
    },
    docUri: {
      type: String,
      required: true,
    },
    docName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Docs: Model<IDocsSchema> =
  mongoose.models.Docs || mongoose.model<IDocsSchema>("Docs", DocsSchema);

export default Docs;
