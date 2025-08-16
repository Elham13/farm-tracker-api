import { type HydratedDocument, type PipelineStage, Types } from "mongoose";
import Crop from "@/common/db/models/crop";
import Docs from "@/common/db/models/docs";
import Operations from "@/common/db/models/operations";
import OperationsMaster from "@/common/db/models/operations-master";
import {
  calculateFertilizerEmission,
  calculateHarvestingEmission,
  calculateIrrigationEmission,
  calculatePesticideEmission,
  calculateSowingEmission,
  calculateTillingEmissions,
} from "@/common/utils/helpers/emission-helpers";
import type { TDoc } from "../docs/docsModel";
import type {
  TAddOperations,
  TDownloadOpDetailsInput,
  TGetOperationsByIdInput,
  TGetOperationsInput,
  TOperations,
  TOperationsDetailed,
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

    const crop = await Crop.findById(input?.cropId);
    if (!crop) throw new Error(`No crop found with the id ${input?.cropId}`);

    switch (operationMaster?.label) {
      case "Tilling": {
        calculateTillingEmissions({
          areaCovered: input?.areaCovered,
          areaCoveredUnit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
          cropId: input?.cropId,
        });
        break;
      }
      case "Sowing": {
        calculateSowingEmission({
          areaCovered: input?.areaCovered,
          areaCoveredUnit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
          mode: input?.mode,
          cropId: input?.cropId,
        });
        break;
      }
      case "Fertilizer": {
        calculateFertilizerEmission({
          areaCovered: input?.areaCovered,
          areaCoveredUnit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
          mode: input?.mode,
          fertilizerType: input?.fertilizerType ?? "",
          quantityToday: input?.quantityToday ?? 0,
          quantityUnit: input?.quantityUnit ?? "",
          waterConsumed: input?.waterConsumed ?? 0,
          cropId: input?.cropId,
        });
        break;
      }
      case "Pesticide": {
        calculatePesticideEmission({
          areaCovered: input?.areaCovered,
          areaCoveredUnit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
          mode: input?.mode,
          fertilizerType: input?.fertilizerType ?? "",
          quantityToday: input?.quantityToday ?? 0,
          quantityUnit: input?.quantityUnit ?? "",
          waterConsumed: input?.waterConsumed ?? 0,
          cropId: input?.cropId,
        });
        break;
      }
      case "Irrigation": {
        calculateIrrigationEmission({
          motorCapacity: input?.motorCapacityInHP ?? 0,
          duration: input?.durationToday ?? 0,
          energySource: input?.energySource ?? "",
          cropId: input?.cropId,
        });
        break;
      }
      case "Harvesting": {
        calculateHarvestingEmission({
          areaCovered: input?.areaCovered,
          areaCoveredUnit: input?.areaCoveredUnit,
          isOwner: input?.tractorOwnership === "Own",
          cropId: input?.cropId,
        });
        break;
      }
      default:
        break;
    }

    const operation = await Operations.create(input);

    if (input?.docUri && input?.docName) {
      const docPayload: Omit<TDoc, "_id" | "createdAt" | "updatedAt"> = {
        operationId: operation?._id as unknown as string,
        cropId: crop?._id as unknown as string,
        docName: input?.docName,
        masterId: operationMaster?._id as unknown as string,
        docUri: input?.docUri,
      };

      await Docs.create(docPayload);
    }

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

  async downloadOperationDetailsAsync(
    input: TDownloadOpDetailsInput
  ): Promise<TOperationsDetailed[]> {
    const { cropId } = input;
    const pipelines: PipelineStage[] = [
      {
        $match: {
          cropId: new Types.ObjectId(cropId),
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
    ];

    const data = (await Operations.aggregate(
      pipelines
    )) as TOperationsDetailed[];

    const operations: TOperationsDetailed[] = [];

    for (const item of data) {
      const doc = await Docs.findOne({ operationId: item?._id });
      if (doc) {
        item.docUri = doc?.docUri;
        item.docName = doc?.docName;
      }
      operations.push(item);
    }

    return operations;
  }
}
