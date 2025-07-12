import type { Request } from "express";
import type { Role } from "../constants/enums";

export interface UserInReq {
  userId: string;
  phone: string;
  role: (typeof Role)[keyof typeof Role];
  iat: Date;
  exp: Date;
}

export interface EnhancedRequest extends Request {
  user?: UserInReq;
}

export interface IFarm {
  _id: string;
  name: string;
  size: string;
  address: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}
