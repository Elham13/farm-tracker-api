import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import type { HydratedDocument } from "mongoose";
import type z from "zod";
import User from "@/common/db/models/user";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import type { Role } from "@/common/utils/constants/enums";
import { env } from "@/common/utils/envConfig";
import { generateAccessToken, generateRefreshToken } from "@/common/utils/jwt";
import type { CreateUserSchema, TUser } from "../user/userModel";
import type {
  LoginResponse,
  TLoginInput,
  TRefreshTokenResponse,
} from "./authModel";

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

  async refreshTokenAsync(
    token: string
  ): Promise<TRefreshTokenResponse | null> {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        userId: string;
      };

      const user: HydratedDocument<TUser> | null = await User.findById(
        decoded.userId
      );
      if (!user) return null;

      const newAccessToken = await generateAccessToken({
        userId: user._id,
        phone: user.phone,
        role: user.role as unknown as typeof Role,
      });
      const newRefreshToken = await generateRefreshToken({ userId: user._id });

      return { newAccessToken, newRefreshToken };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError)
        throw new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED);

      if (error instanceof jwt.TokenExpiredError)
        throw new ErrorHandler("Token expired", StatusCodes.UNAUTHORIZED);

      throw new ErrorHandler(
        "Authentication failed",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
