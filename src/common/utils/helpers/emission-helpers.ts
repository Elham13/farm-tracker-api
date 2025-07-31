import Emission from "@/common/db/models/emission";
import EmissionFactor from "@/common/db/models/emission-factor";
import type { IEmission } from "../type";

interface ITillingArgs {
  areaCovered: number;
  isOwner: boolean;
  areaCoveredUnit: string;
}

export const calculateTillingEmissions = async (args: ITillingArgs) => {
  const { areaCoveredUnit, areaCovered, isOwner } = args;
  const factors = await EmissionFactor.findOne();
  if (!factors) throw new Error("Emission factors not found");

  const emissionFactor =
    areaCoveredUnit === "acre"
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
    unit: `kgCO2e/${areaCoveredUnit}`,
    calculation: `${areaCovered} ${areaCoveredUnit} × ${emissionFactor} kgCO2e/${areaCoveredUnit}`,
  };

  await Emission.create(payload);
};

type TSowingArgs = ITillingArgs & { mode: string };

export const calculateSowingEmission = async (args: TSowingArgs) => {
  const { areaCovered, mode, isOwner, areaCoveredUnit } = args;
  const operation = "Sowing";
  const factors = await EmissionFactor.findOne();
  if (!factors) {
    throw new Error("Emission factors not found in database");
  }

  // Tractor mode calculation
  if (mode === "Tractor") {
    const emissionFactor =
      areaCoveredUnit === "acre"
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
      unit: `kgCO2e/${areaCoveredUnit}`,
      calculation: `${areaCovered} ${areaCoveredUnit} × ${emissionFactor} kgCO2e/${areaCoveredUnit} (tractor) = ${emission} kgCO2e`,
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
      unit: `kgCO2e/${areaCoveredUnit}`,
      calculation: `${electricityConsumed} kWh × ${factors.gridPowerEmFct} kgCO2e/kWh = ${emission} kgCO2e`,
    };

    await Emission.create(payload);
    await Emission.create({
      operation: `${operation} ${mode} Electricity`,
      electricityConsumption: electricityConsumed,
      category: "Electricity",
      categoryUnit: "kWh",
      unit: `kWh/${areaCoveredUnit}`,
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
    areaCoveredUnit,
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
      areaCoveredUnit === "acre"
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
      unit: `kgCO2e/${areaCoveredUnit}`,
      calculation: `${areaCovered} ${areaCoveredUnit} × ${tractorEmissionFactor} kgCO2e/${areaCoveredUnit} (tractor) = ${tractorEmission} kgCO2e`,
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
      unit: `kgCO2e/${areaCoveredUnit}`,
      calculation: `${electricityConsumed} kWh × ${factors.gridPowerEmFct} kgCO2e/kWh = ${droneEmission} kgCO2e`,
    };

    await Emission.create(dronePayload);

    const droneElectricityPayload = {
      operation: `${operation} ${mode} Electricity`,
      electricityConsumption: electricityConsumed,
      category: "Electricity",
      categoryUnit: "kWh",
      unit: `kWh/${areaCoveredUnit}`,
      calculation: `${areaCovered} acres × ${factors.dronePowerConsumption} kWh/acre = ${electricityConsumed} kWh`,
    };
    await Emission.create(droneElectricityPayload);
  }
};

interface IPesticideArgs extends ITillingArgs {
  quantityToday: number;
  fertilizerType: string;
  waterConsumed: number;
  quantityUnit: string;
  mode: string;
}

export const calculatePesticideEmission = async (args: IPesticideArgs) => {
  const {
    quantityToday,
    fertilizerType,
    waterConsumed,
    quantityUnit,
    mode,
    areaCovered,
    areaCoveredUnit,
    isOwner,
  } = args;
  const factors = await EmissionFactor.findOne();
  if (!factors) throw new Error("Emission Factors not found");

  const operation = "Pesticide";

  const emissionFactor =
    fertilizerType === "Chemical"
      ? factors.chemicalEmFctPesticide
      : factors.organicEmFctPesticide;

  const emission = quantityToday * emissionFactor;
  const waterInKiloLiters = waterConsumed / 1000;

  // Main pesticide emission
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

  // Water consumption
  await Emission.create({
    operation,
    waterConsumption: waterInKiloLiters,
    category: "Water",
    categoryUnit: "kL",
    unit: `kL`,
    calculation: `${waterConsumed} (liters) / 1000 = ${waterInKiloLiters} kL`,
  });

  // Tractor emissions if applicable
  if (mode === "Tractor") {
    const tractorEmissionFactor =
      areaCoveredUnit === "acre"
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
      unit: `kgCO2e/${areaCoveredUnit}`,
      calculation: `${areaCovered} ${areaCoveredUnit} × ${tractorEmissionFactor} kgCO2e/${areaCoveredUnit} (tractor) = ${tractorEmission} kgCO2e`,
    });
  }
  // Drone emissions if applicable
  else if (mode === "Drone") {
    const electricityConsumed =
      areaCovered * (factors.dronePowerConsumption ?? 0);
    const droneEmission = areaCovered * factors.droneEmFctSowing;
    const droneScope = isOwner ? "Scope 2" : "Scope 3";

    // Drone emissions
    await Emission.create({
      operation: `${operation} ${mode}`,
      emission: droneEmission,
      scope: droneScope,
      electricityConsumption: electricityConsumed,
      category: "GHG Emissions",
      categoryUnit: "kgCO2e",
      unit: `kgCO2e/${areaCoveredUnit}`,
      calculation: `${electricityConsumed} kWh × ${factors.gridPowerEmFct} kgCO2e/kWh = ${droneEmission} kgCO2e`,
    });

    // Drone electricity consumption
    await Emission.create({
      operation: `${operation} ${mode} Electricity`,
      electricityConsumption: electricityConsumed,
      category: "Electricity",
      categoryUnit: "kWh",
      unit: `kWh/${areaCoveredUnit}`,
      calculation: `${areaCovered} acres × ${factors.dronePowerConsumption} kWh/acre = ${electricityConsumed} kWh`,
    });
  }
};

interface IIrrigationArgs {
  motorCapacity: number; // in HP
  duration: number; // in hours
  energySource: string; // "Diesel" | "Grid" | "Solar"
}

export const calculateIrrigationEmission = async (args: IIrrigationArgs) => {
  const { motorCapacity, duration, energySource } = args;
  const factors = await EmissionFactor.findOne();
  if (!factors) throw new Error("Emission Factors not found");

  const operation = "Irrigation";

  // Calculate water consumption (same for all energy sources)
  const waterConsumed = motorCapacity * duration * factors.waterPerHPPerHour;
  const waterInKiloLiters = waterConsumed / 1000;

  // Calculate electricity consumption (same for all energy sources)
  const electricityConsumed =
    motorCapacity * duration * factors.energyPerHPPerHour;

  // Water consumption record
  await Emission.create({
    operation: `${operation} Water`,
    waterConsumption: waterInKiloLiters,
    category: "Water",
    categoryUnit: "kL",
    unit: "kL",
    calculation: `${motorCapacity} HP × ${duration} hours × ${factors.waterPerHPPerHour} liters/HP/hour = ${waterConsumed} liters (${waterInKiloLiters} kL)`,
  });

  // Electricity consumption record (even for diesel as it's the same calculation)
  await Emission.create({
    operation: `${operation} Electricity`,
    electricityConsumption: electricityConsumed,
    category: "Electricity",
    categoryUnit: "kWh",
    unit: "kWh",
    calculation: `${motorCapacity} HP × ${duration} hours × ${factors.energyPerHPPerHour} kWh/HP/hour = ${electricityConsumed} kWh`,
  });

  // Handle different energy sources
  if (energySource === "Diesel") {
    const dieselConsumed =
      motorCapacity * duration * factors.dieselPerHPPerHour;
    const emission = dieselConsumed * factors.dieselEmFctEnergy;

    // Diesel consumption record
    await Emission.create({
      operation: `${operation} Diesel`,
      dieselConsumption: dieselConsumed,
      category: "Diesel",
      categoryUnit: "liters",
      unit: "liters",
      calculation: `${motorCapacity} HP × ${duration} hours × ${factors.dieselPerHPPerHour} liters/HP/hour = ${dieselConsumed} liters`,
    });

    // Diesel emissions record (Scope 1)
    await Emission.create({
      operation: `${operation} Emissions`,
      emission,
      scope: "Scope 1",
      category: "GHG Emissions",
      categoryUnit: "kgCO2e",
      unit: "kgCO2e",
      calculation: `${dieselConsumed} liters × ${factors.dieselEmFctEnergy} kgCO2e/liter = ${emission} kgCO2e`,
    });
  } else if (energySource === "Grid") {
    const emission = electricityConsumed * factors.gridPowerEmFct;

    // Grid emissions record (Scope 2)
    await Emission.create({
      operation: `${operation} Emissions`,
      emission,
      scope: "Scope 2",
      category: "GHG Emissions",
      categoryUnit: "kgCO2e",
      unit: "kgCO2e",
      calculation: `${electricityConsumed} kWh × ${factors.gridPowerEmFct} kgCO2e/kWh = ${emission} kgCO2e`,
    });
  }
  // Solar has no emissions, so we just record the electricity and water
};

interface IHarvestingArgs extends ITillingArgs {
  // Inherits areaCovered, areaCoveredUnit, isOwner from ITillingArgs
}

export const calculateHarvestingEmission = async (args: IHarvestingArgs) => {
  const { areaCovered, areaCoveredUnit, isOwner } = args;
  const factors = await EmissionFactor.findOne();
  if (!factors) throw new Error("Emission Factors not found");

  const operation = "Harvesting";

  const emissionFactor =
    areaCoveredUnit === "acre"
      ? factors.harvesterEmFctHarvesting.perAcre
      : factors.harvesterEmFctHarvesting.perHectare;

  const emission = areaCovered * emissionFactor;
  const scope = isOwner ? "Scope 1" : "Scope 3";

  await Emission.create({
    operation,
    emission,
    scope,
    category: "GHG Emissions",
    categoryUnit: "kgCO2e",
    unit: `kgCO2e/${areaCoveredUnit}`,
    calculation: `${areaCovered} ${areaCoveredUnit} × ${emissionFactor} kgCO2e/${areaCoveredUnit} = ${emission} kgCO2e`,
  });
};
