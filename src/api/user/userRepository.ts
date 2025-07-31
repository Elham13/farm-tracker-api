import type { PipelineStage } from "mongoose";
import type { TGetUserQuery, TUpdateUser, TUser } from "@/api/user/userModel";
import User from "@/common/db/models/user";

export class UserRepository {
  async findAllAsync({ role }: TGetUserQuery): Promise<TUser[]> {
    const match: PipelineStage.Match["$match"] = {};

    if (role) match.role = role;

    const pipelines: PipelineStage[] = [
      { $match: match },
      {
        $project: {
          password: 0,
        },
      },
    ];
    return await User.aggregate(pipelines);
  }

  async findByIdAsync(id: string): Promise<TUser | null> {
    return await User.findById(id).select("-password");
  }

  async deleteUserAsync(id: string): Promise<TUser | null> {
    return await User.findByIdAndDelete(id);
  }
  async updateUserAsync(input: TUpdateUser): Promise<TUser | null> {
    return await User.findByIdAndUpdate(input?._id, input, {
      new: true,
    }).select("-password");
  }
}
