import type { HydratedDocument } from "mongoose";
import EmissionFactor from "@/common/db/models/emission-factor";
import type { TAddEF, TEF, TGetEFByIdInput } from "./efModel";

export class EFRepository {
  async getEFAsync(): Promise<TEF[]> {
    const operations: TEF[] = await EmissionFactor.find({});
    return operations;
  }

  async getEFByIdAsync(input: TGetEFByIdInput): Promise<TEF | null> {
    const { id } = input;
    const operation: HydratedDocument<TEF> | null =
      await EmissionFactor.findOne({
        _id: id,
      });
    if (!operation) return null;
    return operation.toJSON();
  }

  async addEFAsync(input: TAddEF): Promise<TEF> {
    const operation = await EmissionFactor.create(input);
    return operation.toJSON() as unknown as TEF;
  }
}
