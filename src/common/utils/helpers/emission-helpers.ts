import Emission from "@/common/db/models/emission";
import EmissionFactor from "@/common/db/models/emission-factor";
import type { IEmission } from "../type";

interface ITillingArgs {
  areaCovered: number;
  isOwner: boolean;
  unit: string;
}

export const calculateTillingEmissions = async (args: ITillingArgs) => {
  const { unit, areaCovered, isOwner } = args;
  const factors = await EmissionFactor.findOne();
  if (!factors) throw new Error("Emission factors not found");

  const emissionFactor =
    unit === "acre"
      ? factors.tractorEmFctTilling.perAcre
      : factors.tractorEmFctTilling.perHectare;

  const emission = areaCovered * emissionFactor;
  const scope = isOwner ? "Scope 1" : "Scope 3";

  const payload: IEmission = {
    operation: "Tilling",
    emission,
    scope,
    category: "GHG Emissions",
    categoryUnit: "kgCO2e",
    unit: `kgCO2e/${unit}`,
    calculation: `${areaCovered} ${unit} × ${emissionFactor} kgCO2e/${unit}`,
  };

  await Emission.create(payload);
};

type TSowingArgs = ITillingArgs & { mode: string };

export const calculateSowingEmission = async (args: TSowingArgs) => {
  const { areaCovered, mode, isOwner, unit } = args;
  const operation = "Sowing";
  const factors = await EmissionFactor.findOne();
  if (!factors) {
    throw new Error("Emission factors not found in database");
  }

  // Tractor mode calculation
  if (mode === "Tractor") {
    const emissionFactor =
      unit === "acre"
        ? factors.tractorEmFctSowing.perAcre
        : factors.tractorEmFctSowing.perHectare;

    const emission = areaCovered * emissionFactor;
    const scope = isOwner ? "Scope 1" : "Scope 3";

    const payload: IEmission = {
      operation,
      emission,
      scope,
      category: "GHG Emissions",
      categoryUnit: "kgCO2e",
      unit: `kgCO2e/${unit}`,
      calculation: `${areaCovered} ${unit} × ${emissionFactor} kgCO2e/${unit} (tractor) = ${emission} kgCO2e`,
    };
    await Emission.create(payload);
    return;
  }

  // Drone mode calculation
  if (mode === "Drone") {
    const electricityConsumed =
      areaCovered * (factors.dronePowerConsumption ?? 0);
    const emission = areaCovered * factors.droneEmFctSowing;
    const scope = isOwner ? "Scope 2" : "Scope 3";

    const payload: IEmission = {
      operation,
      emission,
      scope,
      electricityConsumption: electricityConsumed,
      category: "GHG Emissions, Electricity",
      categoryUnit: "kgCO2e, kWh",
      unit: `kgCO2e/${unit}, kWh/${unit}`,
      calculation: [
        `${areaCovered} acres × ${factors.dronePowerConsumption} kWh/acre = ${electricityConsumed} kWh`,
        `${electricityConsumed} kWh × ${factors.gridPowerEmFct} kgCO2e/kWh = ${emission} kgCO2e`,
      ].join("\n"),
    };

    await Emission.create(payload);
    return;
  }

  throw new Error("Invalid sowing mode");
};
