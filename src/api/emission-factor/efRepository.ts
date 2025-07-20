import EmissionFactor from "@/common/db/models/emission-factor";
import type { TAddEF, TEF, TGetEFByIdInput, TUpdateEFInput } from "./efModel";

export class EFRepository {
  async getEFAsync(): Promise<TEF[]> {
    const data: TEF[] = await EmissionFactor.find({});
    return data;
  }

  async getEFByIdAsync(input: TGetEFByIdInput): Promise<TEF | null> {
    const { id } = input;
    return await EmissionFactor.findOne({
      _id: id,
    });
  }

  async deleteEFAsync(id: string): Promise<TEF | null> {
    return await EmissionFactor.findByIdAndDelete(id);
  }

  async updateEFAsync(input: TUpdateEFInput): Promise<TEF | null> {
    return await EmissionFactor.findByIdAndUpdate(input._id, input, {
      new: true,
    });
  }

  async addEFAsync(input: TAddEF): Promise<TEF> {
    const data = await EmissionFactor.create(input);
    return data.toJSON() as unknown as TEF;
  }
}
