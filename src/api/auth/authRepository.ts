import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import type { HydratedDocument } from "mongoose";
import type z from "zod";
import User from "@/common/db/models/user";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import type { Role } from "@/common/utils/constants/enums";
import { generateAccessToken, generateRefreshToken } from "@/common/utils/jwt";
import type { CreateUserSchema, TUser } from "../user/userModel";
import type { LoginResponse, TLoginInput } from "./authModel";

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

  async loginAsync(input: TLoginInput): Promise<LoginResponse | null> {
    const { phone, password } = input;
    const user: HydratedDocument<TUser> | null = await User.findOne({ phone });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const accessToken = await generateAccessToken({
      userId: user?._id,
      phone: user.phone,
      role: user.role as unknown as typeof Role,
    });
    const refreshToken = await generateRefreshToken({
      userId: user?._id,
    });

    const res = {
      ...user.toJSON(),
      password: undefined,
      accessToken,
      refreshToken,
    };

    return res;
  }
}
