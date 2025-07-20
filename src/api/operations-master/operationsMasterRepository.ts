import type { HydratedDocument } from "mongoose";
import OperationsMaster from "@/common/db/models/operations-master";
import type {
  TAddOperationsMaster,
  TGetOperationsMasterByIdInput,
  TOperationsMaster,
} from "./operationsMasterModel";

export class OperationsMasterRepository {
  async getOperationsMastersAsync(
    corpId: string
  ): Promise<TOperationsMaster[]> {
    const operationsMaster: TOperationsMaster[] = await OperationsMaster.find({
      crop: corpId,
    });
    return operationsMaster;
  }

  async getOperationsMasterByIdAsync(
    input: TGetOperationsMasterByIdInput
  ): Promise<TOperationsMaster | null> {
    const { id, cropId } = input;
    const operationMaster: HydratedDocument<TOperationsMaster> | null =
      await OperationsMaster.findOne({
        _id: id,
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
