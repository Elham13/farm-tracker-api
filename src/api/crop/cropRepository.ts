import { type HydratedDocument, type PipelineStage, Types } from "mongoose";
import Crop from "@/common/db/models/crop";
import type {
  TAddCrop,
  TCrop,
  TCropExtended,
  TGetCropByIdInput,
  TUpdateCropInput,
} from "./cropModel";

export class CropRepository {
  async getCropsAsync(farmId: string): Promise<TCrop[]> {
    const crops: TCrop[] = await Crop.find({ farm: farmId });
    return crops;
  }

  async getCropByIdAsync({
    id,
  }: TGetCropByIdInput): Promise<TCropExtended | null> {
    const pipelines: PipelineStage[] = [
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: "farms",
          localField: "farm",
          foreignField: "_id",
          as: "farmObj",
        },
      },
      {
        $unwind: {
          path: "$farmObj",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    const data: TCropExtended[] = await Crop.aggregate(pipelines);
    if (!data || !data?.length) return null;
    return data[0];
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
