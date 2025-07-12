import { HydratedDocument } from "mongoose";
import {
  TAddOperationsMaster,
  TOperationsMaster,
  TGetOperationsMasterByIdInput,
} from "./operationsMasterModel";
import OperationsMaster from "@/common/db/models/operations-master";

export class OperationsMasterRepository {
  async getOperationsMastersAsync(
    userId: string,
    corpId: string
  ): Promise<TOperationsMaster[]> {
    const operationsMaster: TOperationsMaster[] = await OperationsMaster.find({
      user: userId,
      crop: corpId,
    });
    return operationsMaster;
  }

  async getOperationsMasterByIdAsync(
    input: TGetOperationsMasterByIdInput
  ): Promise<TOperationsMaster | null> {
    const { id, userId, cropId } = input;
    const operationMaster: HydratedDocument<TOperationsMaster> | null =
      await OperationsMaster.findOne({
        _id: id,
        user: userId,
        crop: cropId,
      });
    if (!operationMaster) return null;
    return operationMaster.toJSON();
  }

  async addOperationsMasterAsync(
    input: TAddOperationsMaster
  ): Promise<TOperationsMaster> {
    const operationMaster = await OperationsMaster.create(input);
    return operationMaster.toJSON() as unknown as TOperationsMaster;
  }
}
