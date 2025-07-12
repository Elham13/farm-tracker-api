import Farm from "@/common/db/models/farm";
import { TAddFarm, TFarm } from "./farmModel";
import { HydratedDocument } from "mongoose";

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
}
