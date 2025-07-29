import type { Request } from "express";
import type { Role } from "../constants/enums";

export interface UserInReq {
  userId: string;
  phone: string;
  role: (typeof Role)[keyof typeof Role];
  iat: Date;
  exp: Date;
}

export interface EnhancedRequest extends Request {
  user?: UserInReq;
}

export interface IEmission {
  operation: string;
  emission: number;
  scope: string;
  unit: string;
  calculation: string;
  category: string;
  categoryUnit: string;
  electricityConsumption?: number;
}

export interface IEmissionFactors {
  // Tilling
  tractorEmFctTilling: {
    perAcre: number; // kgCO2e/acre
    perHectare: number; // kgCO2e/hectare
  };

  // Sowing
  tractorEmFctSowing: {
    perAcre: number; // kgCO2e/acre
    perHectare: number; // kgCO2e/hectare
  };

  // Drone operations
  dronePowerConsumption?: number; // $Drone_power_consumption (kWh/acre)
  gridPowerEmFct: number; // $Grid_power_EmFct (kgCO2e/kWh)
  droneEmFctSowing: number; // kgCO₂e/acre

  // Fertilizer
  chemicalEmFctFertilizer: number; // $Chemical_EmFct_Fertilizer (kgCO2e/kg or liter)
  organicEmFctFertilizer: number; // $Organic_EmFct_Fertilizer (kgCO2e/kg or liter)

  // Pesticide
  chemicalEmFctPesticide: number; // $Chemical_EmFct_Pesticide (kgCO2e/kg or liter)
  organicEmFctPesticide: number; // $Organic_EmFct_Pesticide (kgCO2e/kg or liter)

  // Irrigation
  waterPerHPPerHour: number; // $Water_per_HP_per_Hour (liters/HP/hour)
  energyPerHPPerHour: number; // $Energy_per_HP_per_Hour (kWh/HP/hour)
  dieselPerHPPerHour: number; // $Diesel_per_HP_per_hour (liter/HP/hr)
  dieselEmFctEnergy: number; // $Diesel_EmFct_Energy (kgCO2e/liter)

  // Harvesting
  harvesterEmFctHarvesting: {
    perAcre: number; // kgCO2e/acre
    perHectare: number; // kgCO2e/hectare
  };

  // Metadata
  lastUpdated: Date;
  source: string;
  version: string;
}
