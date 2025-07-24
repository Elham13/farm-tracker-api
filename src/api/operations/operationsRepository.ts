import { type HydratedDocument, type PipelineStage, Types } from "mongoose";
import Operations from "@/common/db/models/operations";
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
