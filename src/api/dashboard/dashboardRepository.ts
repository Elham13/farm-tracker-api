import Crop from "@/common/db/models/crop";
import Farm from "@/common/db/models/farm";
import User from "@/common/db/models/user";
import type { IDashboardCount } from "./dashboardModel";
import Operations from "@/common/db/models/operations";
import { TOperations } from "../operations/operationsModel";
import { PipelineStage } from "mongoose";
import { TCrop } from "../crop/cropModel";

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
}
