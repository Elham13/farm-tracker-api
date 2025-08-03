import {
  type Document,
  type Model,
  model,
  models,
  type ObjectId,
  Schema,
  Types,
} from "mongoose";
import type { IEmission } from "@/common/utils/type";

interface IEmissionSchema extends Document, Omit<IEmission, "cropId"> {
  cropId: ObjectId;
}

const EmissionSchema = new Schema<IEmissionSchema>(
  {
    operation: { type: String, required: true },
    cropId: { type: Types.ObjectId, ref: "Crop", required: true },
    emission: { type: Number },
    scope: { type: String },
    unit: { type: String, required: true },
    calculation: { type: String, required: true },
    category: { type: String, required: true },
    categoryUnit: { type: String, required: true },
    electricityConsumption: { type: Number },
    waterConsumption: { type: Number },
    dieselConsumption: { type: Number },
    energySource: { type: String },
  },
  {
    timestamps: true,
  }
);

const Emission: Model<IEmissionSchema> =
  models.Emission || model<IEmissionSchema>("Emission", EmissionSchema);

export default Emission;
