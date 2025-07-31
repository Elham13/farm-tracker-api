import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { TUser } from "./userModel";
import { UserRepository } from "./userRepository";

class UserController {
  private readonly userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    const data = await this.userRepository.findAllAsync(req.query);
    const serviceResponse = ServiceResponse.success<TUser[]>("Fetched", data);
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

    const serviceResponse = ServiceResponse.success<TUser>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const data = await this.userRepository.deleteUserAsync(id);

    if (!data) {
      return next(
        new ErrorHandler(`User with ID ${id} not found`, StatusCodes.NOT_FOUND)
      );
    }

    const serviceResponse = ServiceResponse.success<TUser>("Deleted", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.userRepository.updateUserAsync(req.body);

    if (!data) {
      return next(
        new ErrorHandler(
          `User with ID ${req.body._id} not found`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    const serviceResponse = ServiceResponse.success<TUser>("Updated", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const userController = new UserController();
