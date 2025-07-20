import type { HydratedDocument } from "mongoose";
import EmissionFactorMaster from "@/common/db/models/emission-factor-master";
import type {
  TAddEFM,
  TEFM,
  TGetEFMByIdInput,
  TUpdateEFMInput,
} from "./efmModel";

export class EFMRepository {
  async getEFMAsync(): Promise<TEFM[]> {
    const operations: TEFM[] = await EmissionFactorMaster.find({});
    return operations;
  }

  async getEFMByIdAsync(input: TGetEFMByIdInput): Promise<TEFM | null> {
    const { id } = input;
    const operation: HydratedDocument<TEFM> | null =
      await EmissionFactorMaster.findOne({
        _id: id,
      });
    if (!operation) return null;
    return operation.toJSON();
  }

  async addEFMAsync(input: TAddEFM): Promise<TEFM> {
    const operation = await EmissionFactorMaster.create(input);
    return operation.toJSON() as unknown as TEFM;
  }

  async deleteEFMAsync(id: string): Promise<TEFM | null> {
    return await EmissionFactorMaster.findByIdAndDelete(id);
  }

  async updateEFMAsync(input: TUpdateEFMInput): Promise<TEFM | null> {
    return await EmissionFactorMaster.findByIdAndUpdate(input._id, input, {
      new: true,
    });
  }
}
