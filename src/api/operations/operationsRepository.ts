import { HydratedDocument } from "mongoose";
import {
  TAddOperations,
  TGetOperationsByIdInput,
  TOperations,
} from "./operationsModel";
import Operations from "@/common/db/models/operations";

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
    const { id, masterId } = input;
    const operation: HydratedDocument<TOperations> | null =
      await Operations.findOne({
        _id: id,
        operationMaster: masterId,
      });
    if (!operation) return null;
    return operation.toJSON();
  }

  async addOperationsAsync(input: TAddOperations): Promise<TOperations> {
    const operation = await Operations.create(input);
    return operation.toJSON() as unknown as TOperations;
  }
}
