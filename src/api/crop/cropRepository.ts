import type { HydratedDocument } from "mongoose";
import Crop from "@/common/db/models/crop";
import type {
  TAddCrop,
  TCrop,
  TGetCropByIdInput,
  TUpdateCropInput,
} from "./cropModel";

export class CropRepository {
  async getCropsAsync(farmId: string): Promise<TCrop[]> {
    const crops: TCrop[] = await Crop.find({ farm: farmId });
    return crops;
  }

  async getCropByIdAsync({ id }: TGetCropByIdInput): Promise<TCrop | null> {
    const crop: HydratedDocument<TCrop> | null = await Crop.findById(id);
    if (!crop) return null;
    return crop.toJSON();
  }

  async deleteCropAsync(id: string): Promise<TCrop | null> {
    const crop: HydratedDocument<TCrop> | null = await Crop.findByIdAndDelete(
      id
    );
    if (!crop) return null;
    return crop.toJSON();
  }

  async updateCropAsync(input: TUpdateCropInput): Promise<TCrop | null> {
    const crop: HydratedDocument<TCrop> | null = await Crop.findByIdAndUpdate(
      input._id,
      input,
      { new: true }
    );
    if (!crop) return null;
    return crop.toJSON();
  }

  async addCropAsync(input: TAddCrop): Promise<TCrop> {
    const crop = await Crop.create(input);
    return crop.toJSON() as unknown as TCrop;
  }
}
