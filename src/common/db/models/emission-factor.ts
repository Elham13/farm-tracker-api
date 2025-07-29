import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { IEmissionFactors } from "@/common/utils/type";

type TEmissionFactors = IEmissionFactors & Document;

const EmissionFactorSchema = new Schema<TEmissionFactors>(
  {
    // Tilling - with both acre and hectare values
    tractorEmFctTilling: {
      type: {
        perAcre: { type: Number, required: true },
        perHectare: { type: Number, required: true },
      },
      required: true,
    },

    // Sowing - with both acre and hectare values
    tractorEmFctSowing: {
      type: {
        perAcre: { type: Number, required: true },
        perHectare: { type: Number, required: true },
      },
      required: true,
    },

    // Drone operations
    dronePowerConsumption: { type: Number }, // kWh/acre - currently unknown
    // kgCO2e/kWh
    gridPowerEmFct: {
      type: Number,
      required: true,
      description: "Grid power emission factor in kgCO2e per kWh",
    },
    // kgCO2e/acre
    droneEmFctSowing: {
      type: Number,
      required: true,
      description: "Drone Emission Factor Sowing in kgCO2e per acre",
    },

    // Fertilizer
    chemicalEmFctFertilizer: {
      type: Number,
      required: true,
      description:
        "Emission factor for chemical fertilizer in kgCO2e per kg or liter",
    },
    organicEmFctFertilizer: {
      type: Number,
      required: true,
      description:
        "Emission factor for organic fertilizer in kgCO2e per kg or liter",
    },

    // Pesticide
    chemicalEmFctPesticide: {
      type: Number,
      required: true,
      description:
        "Emission factor for chemical pesticide in kgCO2e per kg or liter",
    },
    organicEmFctPesticide: {
      type: Number,
      required: true,
      description:
        "Emission factor for organic pesticide in kgCO2e per kg or liter",
    },

    // Irrigation
    waterPerHPPerHour: {
      type: Number,
      required: true,
      description: "Water consumption per HP per hour in liters",
    },
    energyPerHPPerHour: {
      type: Number,
      required: true,
      description: "Energy consumption per HP per hour in kWh",
    },
    dieselPerHPPerHour: {
      type: Number,
      required: true,
      description: "Diesel consumption per HP per hour in liters",
    },
    dieselEmFctEnergy: {
      type: Number,
      required: true,
      description: "Diesel emission factor in kgCO2e per liter",
    },

    // Harvesting - with both acre and hectare values
    harvesterEmFctHarvesting: {
      type: {
        perAcre: { type: Number, required: true },
        perHectare: { type: Number, required: true },
      },
      required: true,
    },

    // Metadata
    lastUpdated: { type: Date, default: Date.now },
    source: { type: String, default: "EartTwin App Default Values" },
    version: { type: String, default: "1.0" },
  },
  { timestamps: true }
);

const EmissionFactor: Model<TEmissionFactors> =
  mongoose.models.EmissionFactor ||
  mongoose.model<TEmissionFactors>("EmissionFactor", EmissionFactorSchema);

export default EmissionFactor;
