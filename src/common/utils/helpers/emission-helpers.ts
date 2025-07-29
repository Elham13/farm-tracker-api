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
      operation: `${operation} ${mode}`,
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
      operation: `${operation} ${mode}`,
      emission,
      scope,
      category: "GHG Emissions",
      categoryUnit: "kgCO2e",
      unit: `kgCO2e/${unit}`,
      calculation: `${electricityConsumed} kWh × ${factors.gridPowerEmFct} kgCO2e/kWh = ${emission} kgCO2e`,
    };

    await Emission.create(payload);
    await Emission.create({
      operation: `${operation} ${mode} Electricity`,
      electricityConsumption: electricityConsumed,
      category: "Electricity",
      categoryUnit: "kWh",
      unit: `kWh/${unit}`,
      calculation: `${areaCovered} acres × ${factors.dronePowerConsumption} kWh/acre = ${electricityConsumed} kWh`,
    });
    return;
  }

  throw new Error("Invalid sowing mode");
};

interface IFertilizerArgs extends ITillingArgs {
  quantityToday: number;
  fertilizerType: string;
  waterConsumed: number;
  quantityUnit: string;
  mode: string;
}

export const calculateFertilizerEmission = async (args: IFertilizerArgs) => {
  const {
    quantityToday,
    fertilizerType,
    waterConsumed,
    quantityUnit,
    mode,
    areaCovered,
    unit,
    isOwner,
  } = args;
  const factors = await EmissionFactor.findOne();
  if (!factors) throw new Error("Emission Factors not found");

  const operation = "Fertilizer";

  const emissionFactor =
    fertilizerType === "Chemical"
      ? factors.chemicalEmFctFertilizer
      : factors.organicEmFctFertilizer;

  const emission = quantityToday * emissionFactor;
  const waterInKiloLiters = waterConsumed / 1000;

  const payload: IEmission = {
    operation,
    emission,
    scope: "Scope 3",
    category: "GHG Emissions",
    categoryUnit: "kgCO2e",
    unit: `kgCO2e/${quantityUnit} (${fertilizerType})`,
    calculation: `${quantityToday} ${fertilizerType} × ${emissionFactor} kgCO2e/${quantityUnit} = ${emission} kgCO2e`,
  };
  await Emission.create(payload);

  await Emission.create({
    operation,
    waterConsumption: waterInKiloLiters,
    category: "Water",
    categoryUnit: "kL",
    unit: `kL`,
    calculation: `${waterConsumed} (liters) / 1000 = ${waterInKiloLiters} kL`,
  });

  if (mode === "Tractor") {
    const tractorEmissionFactor =
      unit === "acre"
        ? factors.tractorEmFctSowing.perAcre
        : factors.tractorEmFctSowing.perHectare;

    const tractorEmission = areaCovered * tractorEmissionFactor;
    const tractorScope = isOwner ? "Scope 1" : "Scope 3";
    await Emission.create({
      operation: `${operation} ${mode}`,
      emission: tractorEmission,
      scope: tractorScope,
      category: "GHG Emissions",
      categoryUnit: "kgCO2e",
      unit: `kgCO2e/${unit}`,
      calculation: `${areaCovered} ${unit} × ${tractorEmissionFactor} kgCO2e/${unit} (tractor) = ${tractorEmission} kgCO2e`,
    });
  } else if (mode === "Drone") {
    const electricityConsumed =
      areaCovered * (factors.dronePowerConsumption ?? 0);
    const droneEmission = areaCovered * factors.droneEmFctSowing;
    const droneScope = isOwner ? "Scope 2" : "Scope 3";

    const dronePayload = {
      operation: `${operation} ${mode}`,
      emission: droneEmission,
      scope: droneScope,
      electricityConsumption: electricityConsumed,
      category: "GHG Emissions",
      categoryUnit: "kgCO2e",
      unit: `kgCO2e/${unit}`,
      calculation: `${electricityConsumed} kWh × ${factors.gridPowerEmFct} kgCO2e/kWh = ${droneEmission} kgCO2e`,
    };

    await Emission.create(dronePayload);

    const droneElectricityPayload = {
      operation: `${operation} ${mode} Electricity`,
      electricityConsumption: electricityConsumed,
      category: "Electricity",
      categoryUnit: "kWh",
      unit: `kWh/${unit}`,
      calculation: `${areaCovered} acres × ${factors.dronePowerConsumption} kWh/acre = ${electricityConsumed} kWh`,
    };
    await Emission.create(droneElectricityPayload);
  }
};
