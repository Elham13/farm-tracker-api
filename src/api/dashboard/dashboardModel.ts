import z from "zod";
import { FarmersUsing } from "@/common/utils/constants/enums";

export interface IDashboardCount {
  farmers: number;
  admins: number;
  farms: number;
  crops: number;
  operations: number;
}

export interface IAggregatedMetrics {
  renewableEnergy: number;
  nonRenewableEnergy: number;
  totalEmissions: number;
  totalWater: number;
}

export interface ICropWiseEmission {
  crop: string;
  total: number;
  scope1: number;
  scope2: number;
  scope3: number;
}

export interface IFarmer {
  _id: string;
  name: string;
  currentCrop: string;
  using: boolean;
}

export interface IFarmersRes {
  content: IFarmer[];
  total: number;
}

export const GetFarmersData = z.object({
  query: z.object({
    using: z.nativeEnum(FarmersUsing, {
      errorMap: () => ({
        message: "Invalid query using value",
      }),
    }),
  }),
});

export type TGetFarmersInput = z.infer<typeof GetFarmersData.shape.query>;

export interface ICropWiseWater {
  cropName: string;
  totalWaterInLiter: number;
}
