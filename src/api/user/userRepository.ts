import type { TUser } from "@/api/user/userModel";
import User from "@/common/db/models/user";

export const users: TUser[] = [
  {
    _id: "686f9e8a07c77bc9afcdd546",
    name: "Alice",
    email: "alice@example.com",
    phone: "92883883884",
    password: "abc123",
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    _id: "686f9e8a07c77bc9afcdd547",
    name: "Robert",
    email: "Robert@example.com",
    phone: "92883883884",
    password: "abc123",
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
];

export class UserRepository {
  async findAllAsync(): Promise<TUser[]> {
    return await User.find({}).select("-password");
  }

  async findByIdAsync(id: string): Promise<TUser | null> {
    return await User.findById(id).select("-password");
  }
}
