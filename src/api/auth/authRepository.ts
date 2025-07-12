import { StatusCodes } from "http-status-codes";
import type { HydratedDocument } from "mongoose";
import type z from "zod";
import User from "@/common/db/models/user";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import type { CreateUserSchema, TUser } from "../user/userModel";
import type { LoginResponse } from "./authModel";

export class AuthRepository {
  async registerAsync(
    user: z.infer<typeof CreateUserSchema.shape.body>
  ): Promise<Omit<TUser, "password">> {
    const existingUser: HydratedDocument<TUser> | null = await User.findOne({
      phone: user.phone,
    });

    if (existingUser)
      throw new ErrorHandler("User already exists", StatusCodes.BAD_REQUEST);

    const newUser = await User.create(user);
    const jsonUser = {
      ...newUser.toJSON(),
      password: undefined,
    } as unknown as TUser;
    return jsonUser;
  }

  async loginAsync(
    phone: string,
    password: string
  ): Promise<LoginResponse | null> {
    return null;
  }
}
