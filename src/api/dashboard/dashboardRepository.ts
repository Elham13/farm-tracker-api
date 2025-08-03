import type { PipelineStage } from "mongoose";
import Crop from "@/common/db/models/crop";
import Emission from "@/common/db/models/emission";
import Farm from "@/common/db/models/farm";
import Operations from "@/common/db/models/operations";
import User from "@/common/db/models/user";
import { FarmersUsing, Role } from "@/common/utils/constants/enums";
import type { TCrop } from "../crop/cropModel";
import type { TOperations } from "../operations/operationsModel";
import type {
  IAggregatedMetrics,
  ICropWiseEmission,
  ICropWiseWater,
  IDashboardCount,
  IFarmer,
  IFarmersRes,
  IUsingData,
  TGetFarmersInput,
} from "./dashboardModel";

export class DashboardRepository {
  async getDashboardCountsAsync(): Promise<IDashboardCount> {
    const payload: IDashboardCount = {
      admins: 0,
      farmers: 0,
      farms: 0,
      crops: 0,
      operations: 0,
    };

    const admins = await User.countDocuments({ role: "ADMIN" });
    payload.admins = admins;

    const farmers = await User.countDocuments({ role: "FARMER" });
    payload.farmers = farmers;

    const farms = await Farm.countDocuments();
    payload.farms = farms;

    const crops = await Crop.countDocuments();
    payload.crops = crops;

    const operations = await Operations.countDocuments();
    payload.operations = operations;

    return payload;
  }

  async getAllOperations(): Promise<TOperations[]> {
    const pipelines: PipelineStage[] = [
      {
        $lookup: {
          from: "operationsmasters",
          localField: "operationMaster",
          foreignField: "_id",
          as: "masterObj",
        },
      },
      {
        $unwind: {
          path: "$masterObj",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "masterObj.icon": 0,
        },
      },
    ];
    return await Operations.aggregate(pipelines);
  }

  async getAllCrops(): Promise<TCrop[]> {
    const pipelines: PipelineStage[] = [{ $match: {} }];
    return await Crop.aggregate(pipelines);
  }

  async getAggregatedMetricsAsync(): Promise<IAggregatedMetrics> {
    // 1. Total Energy (Renewable: Solar, Non-Renewable: Grid/Diesel)
    const emissions = await Emission.find({});
    const renewableEnergy = emissions.reduce(
      (sum, e) =>
        e.electricityConsumption ? sum + e.electricityConsumption : sum,
      0
    );
    const nonRenewableEnergy = emissions.reduce(
      (sum, e) => (e.dieselConsumption ? sum + e.dieselConsumption : sum),
      0
    );

    // 2. Total Carbon Emissions (Scope 1+2+3)
    const totalEmissions = emissions.reduce(
      (sum, e) => (e.emission ? sum + e.emission : sum),
      0
    );

    // 3. Total Water Consumption
    const totalWater = emissions.reduce(
      (sum, e) => (e.waterConsumption ? sum + e.waterConsumption : sum),
      0
    );

    return {
      renewableEnergy: Number(renewableEnergy.toFixed(2)),
      nonRenewableEnergy: Number(nonRenewableEnergy.toFixed(2)),
      totalEmissions: Number(totalEmissions.toFixed(2)),
      totalWater: Number(totalWater.toFixed(2)),
    };
  }

  async getCropWiseEmissionsAsync(): Promise<ICropWiseEmission[]> {
    const crops = await Crop.find().lean();
    const cropEmissions: ICropWiseEmission[] = [];
    for (const crop of crops) {
      const emissions = await Emission.find({ cropId: crop?._id }).lean();
      if (!emissions || emissions?.length < 1) break;

      const total = emissions.reduce((sum, e) => sum + (e.emission || 0), 0);
      const scope1 = emissions
        .filter((e) => e.scope === "Scope 1")
        .reduce((sum, e) => sum + (e.emission || 0), 0);
      const scope2 = emissions
        .filter((e) => e.scope === "Scope 2")
        .reduce((sum, e) => sum + (e.emission || 0), 0);
      const scope3 = emissions
        .filter((e) => e.scope === "Scope 3")
        .reduce((sum, e) => sum + (e.emission || 0), 0);

      const obj: ICropWiseEmission = {
        crop: crop?.name,
        total: Number(total.toFixed(2)),
        scope1: Number(scope1.toFixed(2)),
        scope2: Number(scope2.toFixed(2)),
        scope3: Number(scope3.toFixed(2)),
      };
      cropEmissions.push(obj);
    }

    return cropEmissions;
  }

  async getCropWiseWaterConsumptionAsync(): Promise<ICropWiseWater[]> {
    const crops = await Crop.find().lean();
    const cropEmissions: ICropWiseWater[] = [];
    for (const crop of crops) {
      const emissions = await Emission.find({ cropId: crop?._id }).lean();
      if (!emissions || emissions?.length < 1) break;

      const totalWaterInLiter = emissions.reduce(
        (sum, e) => sum + (e.waterConsumption || 0),
        0
      );

      const obj: ICropWiseWater = {
        cropName: crop?.name,
        totalWaterInLiter: Number(totalWaterInLiter.toFixed(2)),
      };
      cropEmissions.push(obj);
    }

    return cropEmissions;
  }

  async getFarmersDataAsync({ using }: TGetFarmersInput): Promise<IFarmersRes> {
    const query = { role: Role.FARMER };
    const farmers = await User.find(query).lean();

    const farmersData: IFarmer[] = [];
    if (!farmers || farmers?.length < 1) return { content: [], total: 0 };
    for (const farmer of farmers) {
      const crops = await Crop.find({ userId: farmer?._id });
      const data: IUsingData[] = [];

      if (!!crops && crops?.length > 0) {
        switch (using) {
          case FarmersUsing.ELIGIBLE_GREEN_CRED:
          case FarmersUsing.OPTED_FOR_CERT: {
            for (const crop of crops) {
              data.push({
                currentCrop: crop?.name,
                using: Math.random() > 0.5,
              });
            }
            break;
          }
          case FarmersUsing.NATURAL_FERTILIZER: {
            let usesNaturalFertilizer = false;
            for (const crop of crops) {
              const operations = await Operations.find({ cropId: crop?._id });
              const foundOrganic = operations.find(
                (el) => el?.fertilizerType === "Organic"
              );
              if (foundOrganic) usesNaturalFertilizer = true;

              data.push({
                currentCrop: crop?.name,
                using: usesNaturalFertilizer,
              });
              usesNaturalFertilizer = false;
            }
            break;
          }
          case FarmersUsing.SOLAR_WATER: {
            let usesSolarForIrrigation = false;
            for (const crop of crops) {
              const operations = await Operations.find({ cropId: crop?._id });
              const foundSolar = operations.find(
                (el) => el?.energySource === "Solar power"
              );
              if (foundSolar) usesSolarForIrrigation = true;

              data.push({
                currentCrop: crop?.name,
                using: usesSolarForIrrigation,
              });
              usesSolarForIrrigation = false;
            }
            break;
          }
          default:
            break;
        }
      }

      const obj: IFarmer = {
        _id: farmer?._id as unknown as string,
        name: farmer?.name,
        data,
      };

      farmersData.push(obj);
    }

    const total = await User.countDocuments(query);

    return { content: farmersData, total };
  }
}
