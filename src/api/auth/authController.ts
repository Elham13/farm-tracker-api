import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { TUser } from "../user/userModel";
import type { LoginResponse, TRefreshTokenResponse } from "./authModel";
import { AuthRepository } from "./authRepository";

class AuthController {
  private readonly authRepository: AuthRepository;

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.authRepository = repository;
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.authRepository.registerAsync(req.body);

    const serviceResponse = ServiceResponse.success<Omit<TUser, "password">>(
      "Registration successful",
      user,
      StatusCodes.CREATED
    );

    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = await this.authRepository.loginAsync(req.body);
    if (!user) {
      return next(
        new ErrorHandler("Invalid credentials", StatusCodes.UNAUTHORIZED)
      );
    }

    const serviceResponse = ServiceResponse.success<LoginResponse>(
      "Login successful",
      user
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { refreshToken } = req.body;

    const tokens = await this.authRepository.refreshTokenAsync(refreshToken);

    if (!tokens)
      return next(new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED));

    const serviceResponse = ServiceResponse.success<TRefreshTokenResponse>(
      "Token Refresh successful",
      tokens
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const authController = new AuthController();
