import { type HydratedDocument, type PipelineStage, Types } from "mongoose";
import Operations from "@/common/db/models/operations";
import OperationsMaster from "@/common/db/models/operations-master";
import {
  calculateFertilizerEmission,
  calculateSowingEmission,
  calculateTillingEmissions,
} from "@/common/utils/helpers/emission-helpers";
import type {
  TAddOperations,
  TGetOperationsByIdInput,
  TGetOperationsInput,
  TOperations,
  TUpdateOperationsInput,
} from "./operationsModel";

export class OperationsRepository {
  async getOperationsAsync(input: TGetOperationsInput): Promise<TOperations[]> {
    const { cropId, masterId } = input;

    const pipelines: PipelineStage[] = [
      {
        $match: {
          cropId: new Types.ObjectId(cropId),
          operationMaster: new Types.ObjectId(masterId),
        },
      },
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

    const operations: TOperations[] = await Operations.aggregate(pipelines);
    return operations;
  }

  async getOperationsByIdAsync(
    input: TGetOperationsByIdInput
  ): Promise<TOperations | null> {
    const { id } = input;
    const operation: HydratedDocument<TOperations> | null =
      await Operations.findById(id);
    if (!operation) return null;
    return operation.toJSON();
  }

  async addOperationsAsync(input: TAddOperations): Promise<TOperations> {
    const operationMaster = await OperationsMaster.findById(
      input?.operationMaster
    );

    if (!operationMaster)
      throw new Error(
        `No operation found with the id ${input?.operationMaster}`
      );

    switch (operationMaster?.label) {
      case "Tilling": {
        calculateTillingEmissions({
          areaCovered: input?.areaCovered,
          unit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
        });
        break;
      }
      case "Sowing": {
        calculateSowingEmission({
          areaCovered: input?.areaCovered,
          unit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
          mode: input?.mode,
        });
        break;
      }
      case "Fertilizer": {
        calculateFertilizerEmission({
          areaCovered: input?.areaCovered,
          unit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
          mode: input?.mode,
          fertilizerType: input?.fertilizerType ?? "",
          quantityToday: input?.quantityToday ?? 0,
          quantityUnit: input?.quantityUnit ?? "",
          waterConsumed: input?.waterConsumed ?? 0,
        });
        break;
      }
      default:
        break;
    }

    const operation = await Operations.create(input);
    return operation.toJSON() as unknown as TOperations;
  }

  async deleteOperationAsync(id: string): Promise<TOperations | null> {
    return await Operations.findByIdAndDelete(id);
  }

  async updateOperationAsync(
    input: TUpdateOperationsInput
  ): Promise<TOperations | null> {
    return await Operations.findByIdAndUpdate(input._id, input, {
      new: true,
    });
  }
}
