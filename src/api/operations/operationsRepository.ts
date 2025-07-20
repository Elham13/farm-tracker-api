import type { HydratedDocument } from "mongoose";
import Operations from "@/common/db/models/operations";
import type {
  TAddOperations,
  TGetOperationsByIdInput,
  TOperations,
  TUpdateOperationsInput,
} from "./operationsModel";

export class OperationsRepository {
  async getOperationsAsync(masterId: string): Promise<TOperations[]> {
    const operations: TOperations[] = await Operations.find({
      operationMaster: masterId,
    });
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
