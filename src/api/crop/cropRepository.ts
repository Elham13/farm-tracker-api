import { HydratedDocument } from "mongoose";
import { TAddCrop, TCrop, TGetCropByIdInput } from "./cropModel";
import Crop from "@/common/db/models/crop";

export class CropRepository {
  async getCropsAsync(farmId: string): Promise<TCrop[]> {
    const crops: TCrop[] = await Crop.find({ farm: farmId });
    return crops;
  }

  async getCropByIdAsync(input: TGetCropByIdInput): Promise<TCrop | null> {
    const { id, farmId } = input;
    const crop: HydratedDocument<TCrop> | null = await Crop.findOne({
      _id: id,
      farm: farmId,
    });
    if (!crop) return null;
    return crop.toJSON();
  }

  async addCropAsync(input: TAddCrop): Promise<TCrop> {
    const crop = await Crop.create(input);
    return crop.toJSON() as unknown as TCrop;
  }
}
