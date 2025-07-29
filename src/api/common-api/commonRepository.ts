import Emission from "@/common/db/models/emission";
import EmissionFactor from "@/common/db/models/emission-factor";
import type { IEmission } from "@/common/utils/type";

export class CommonRepository {
  async initializeEmissionFactors() {
    const existing = await EmissionFactor.findOne();
    if (!existing) {
      await EmissionFactor.create({
        // Tilling (with both units)
        tractorEmFctTilling: {
          perAcre: 28.98, // kgCO2e/acre
          perHectare: 71.6, // kgCO2e/hectare
        },

        // Sowing (with both units)
        // TODO: Add the value when it's found
        dronePowerConsumption: undefined,
        tractorEmFctSowing: {
          perAcre: 22.23, // kgCO2e/acre
          perHectare: 54.94, // kgCO2e/hectare
        },

        // Energy
        gridPowerEmFct: 0.727, // kgCO2e/kWh

        // droneEmFctSowing = (dronePowerConsumption * gridPowerEmFct) kgCO2e/acre
        droneEmFctSowing: 0 * 0.727,

        // Fertilizer
        chemicalEmFctFertilizer: 0.454, // kgCO2e/kg or liter
        organicEmFctFertilizer: 0.323, // kgCO2e/kg or liter

        // Pesticide
        chemicalEmFctPesticide: 5.41, // kgCO2e/kg or liter
        organicEmFctPesticide: 5.41, // kgCO2e/kg or liter

        // Irrigation
        waterPerHPPerHour: 3300, // liters/HP/hour
        energyPerHPPerHour: 0.746, // kWh/HP/hour
        dieselPerHPPerHour: 0.285, // liter/HP/hr
        dieselEmFctEnergy: 2.635, // kgCO2e/liter

        // Harvesting (with both units)
        harvesterEmFctHarvesting: {
          perAcre: 14.53, // kgCO2e/acre
          perHectare: 35.91, // kgCO2e/hectare
        },
      });
    }
  }

  async getAllEmissionsAsync() {
    const data = await Emission.find({});
    return JSON.parse(JSON.stringify(data)) as IEmission[];
  }
}
