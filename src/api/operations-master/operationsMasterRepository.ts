import type { HydratedDocument } from "mongoose";
import OperationsMaster from "@/common/db/models/operations-master";
import type {
  TAddOperationsMaster,
  TGetOperationsMasterByIdInput,
  TOperationsMaster,
  TUpdateOperationsMasterInput,
} from "./operationsMasterModel";

export class OperationsMasterRepository {
  async getOperationsMastersAsync(
    corpId: string
  ): Promise<TOperationsMaster[]> {
    const operationsMaster: TOperationsMaster[] = (await OperationsMaster.find({
      crop: corpId,
    }).sort({ createdAt: 1 })) as unknown as TOperationsMaster[];
    return operationsMaster;
  }

  async getOperationsMasterByIdAsync(
    input: TGetOperationsMasterByIdInput
  ): Promise<TOperationsMaster | null> {
    const { id } = input;
    const operationMaster: HydratedDocument<TOperationsMaster> | null =
      await OperationsMaster.findById(id);
    if (!operationMaster) return null;
    return operationMaster.toJSON();
  }

  async addOperationsMasterAsync(
    input: TAddOperationsMaster
  ): Promise<TOperationsMaster> {
    const operationMaster = await OperationsMaster.create(input);
    return operationMaster.toJSON() as unknown as TOperationsMaster;
  }

  async deleteOperationsMasterAsync(
    id: string
  ): Promise<TOperationsMaster | null> {
    return await OperationsMaster.findByIdAndDelete(id);
  }

  async updateOperationsMasterAsync(
    input: TUpdateOperationsMasterInput
  ): Promise<TOperationsMaster | null> {
    return await OperationsMaster.findByIdAndUpdate(input._id, input, {
      new: true,
    });
  }
}
