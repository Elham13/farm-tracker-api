import type { PipelineStage } from "mongoose";
import type {
  TGetUserQuery,
  TPaginatedUsersResponse,
  TUpdateUser,
  TUser,
} from "@/api/user/userModel";
import User from "@/common/db/models/user";

export class UserRepository {
  async findAllAsync({
    role,
    search,
    sort,
    page = "1",
    limit = "10",
  }: TGetUserQuery): Promise<TPaginatedUsersResponse> {
    const match: PipelineStage.Match["$match"] = {};

    if (role) match.role = role;

    if (search) {
      match.name = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const countPipeline: PipelineStage[] = [
      { $match: match },
      { $count: "total" },
    ];

    const dataPipeline: PipelineStage[] = [
      { $match: match },
      {
        $project: {
          password: 0,
        },
      },
    ];

    if (sort) {
      const sortArray = JSON.parse(sort);
      if (sortArray.length > 0) {
        const sortStage: PipelineStage.Sort["$sort"] = {};

        sortArray.forEach((sortItem: { id: string; desc: boolean }) => {
          const field = sortItem.id;
          const direction = sortItem.desc ? -1 : 1;
          sortStage[field] = direction;
        });

        dataPipeline.push({ $sort: sortStage });
      }
    }

    dataPipeline.push({ $skip: skip }, { $limit: Number(limit) });

    const [countResult, content] = await Promise.all([
      User.aggregate(countPipeline),
      User.aggregate(dataPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    return {
      content,
      total,
    };
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
