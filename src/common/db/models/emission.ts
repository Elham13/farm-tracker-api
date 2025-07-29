import { type Document, type Model, model, models, Schema } from "mongoose";
import type { IEmission } from "@/common/utils/type";

type TEmissionSchema = IEmission & Document;

const EmissionSchema = new Schema<TEmissionSchema>(
  {
    operation: { type: String, required: true },
    emission: { type: Number, required: true },
    scope: { type: String, required: true },
    unit: { type: String, required: true },
    calculation: { type: String, required: true },
    category: { type: String, required: true },
    categoryUnit: { type: String, required: true },
    electricityConsumption: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Emission: Model<TEmissionSchema> =
  models.Emission || model<TEmissionSchema>("Emission", EmissionSchema);

export default Emission;
