import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "@/api/user/userService";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { User } from "./userModel";
import { UserRepository } from "./userRepository";

class UserController {
  private readonly userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const data = await this.userRepository.findAllAsync();
    const serviceResponse = ServiceResponse.success<User[]>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const data = await this.userRepository.findByIdAsync(id);

    if (!data) {
      return next(
        new ErrorHandler(`User with ID ${id} not found`, StatusCodes.NOT_FOUND)
      );
    }

    const serviceResponse = ServiceResponse.success<User>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await userService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const userController = new UserController();
