import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { LoginResponse } from "./authModel";
import { AuthRepository } from "./authRepository";

class AuthController {
  private readonly authRepository: AuthRepository;

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.authRepository = repository;
  }

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Registration logic would go here
    return next(
      new ErrorHandler(
        "Registration not implemented",
        StatusCodes.NOT_IMPLEMENTED
      )
    );
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { phone, password } = req.body;

    const user = await this.authRepository.loginAsync(phone, password);
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
}

export const authController = new AuthController();
