import Crop from "@/common/db/models/crop";
import Farm from "@/common/db/models/farm";
import User from "@/common/db/models/user";
import type { IDashboardCount } from "./dashboardModel";

export class DashboardRepository {
  async getDashboardCountsAsync(): Promise<IDashboardCount> {
    const payload: IDashboardCount = {
      admins: 0,
      farmers: 0,
      farms: 0,
      crops: 0,
    };

    const admins = await User.countDocuments({ role: "ADMIN" });
    payload.admins = admins;

    const farmers = await User.countDocuments({ role: "FARMER" });
    payload.farmers = farmers;

    const farms = await Farm.countDocuments();
    payload.farms = farms;

    const crops = await Crop.countDocuments();
    payload.crops = crops;

    return payload;
  }
}
