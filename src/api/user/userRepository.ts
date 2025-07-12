import type { User } from "@/api/user/userModel";

export const users: User[] = [
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
  async findAllAsync(): Promise<User[]> {
    return users;
  }

  async createAsync(user: Omit<User, "_id">): Promise<User> {
    const newUser: User = {
      ...user,
      _id: (Math.random() * 1000000).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  }

  async findByIdAsync(id: string): Promise<User | null> {
    return users.find((user) => user._id === id) || null;
  }
}
