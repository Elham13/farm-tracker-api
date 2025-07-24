import type { HydratedDocument } from "mongoose";
import Crop from "@/common/db/models/crop";
import Farm from "@/common/db/models/farm";
import type { TAddFarm, TFarm, TUpdateFarmInput } from "./farmModel";

export class FarmRepository {
  async getFarmsAsync(userId: string): Promise<TFarm[]> {
    const farms: TFarm[] = await Farm.find({ user: userId });
    return farms;
  }

  async getFarmByIdAsync(userId: string, id: string): Promise<TFarm | null> {
    const farm: HydratedDocument<TFarm> | null = await Farm.findOne({
      _id: id,
      user: userId,
    });
    if (!farm) return null;
    return farm.toJSON();
  }

  async addFarmsAsync(input: TAddFarm): Promise<TFarm> {
    const farm = await Farm.create(input);
    return farm.toJSON() as unknown as TFarm;
  }

  async deleteFarmAsync(id: string): Promise<TFarm | null> {
    await Crop.deleteMany({ farm: id });
    return await Farm.findByIdAndDelete(id);
  }

  async updateFarmAsync(input: TUpdateFarmInput): Promise<TFarm | null> {
    return await Farm.findByIdAndUpdate(input._id, input, {
      new: true,
    });
  }
}
