import jwt, { type SignOptions } from "jsonwebtoken";
import type { Role } from "@/common/utils/constants/enums";
import { env } from "./envConfig";

export const generateAccessToken = async (data: {
  userId: string;
  phone: string;
  role: typeof Role;
}) => {
  if (env.JWT_SECRET && env.JWT_EXPIRY) {
    const token = jwt.sign(data, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRY as SignOptions["expiresIn"],
    });
    return token;
  }
  throw new Error("JWT_SECRET not found");
};

export const generateRefreshToken = async (data: { userId: string }) => {
  if (env.JWT_SECRET && env.JWT_EXPIRY) {
    const token = jwt.sign(data, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  }
  throw new Error("JWT_SECRET not found");
};
