import { NextFunction, RequestHandler, Response } from "express";
import { FarmRepository } from "./farmRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { EnhancedRequest } from "@/common/utils/type";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { StatusCodes } from "http-status-codes";
import { TFarm } from "./farmModel";

class FarmController {
  private readonly farmRepository: FarmRepository;

  constructor(repository: FarmRepository = new FarmRepository()) {
    this.farmRepository = repository;
  }

  public addFarm: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.userId;
    if (!userId)
      return next(new ErrorHandler("No user found!", StatusCodes.UNAUTHORIZED));

    const farm = await this.farmRepository.addFarmsAsync({
      ...req.body,
      user: userId,
    });
    const serviceResponse = ServiceResponse.success<TFarm>(
      "Created",
      farm,
      StatusCodes.CREATED
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getFarms: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.userId;
    if (!userId)
      return next(new ErrorHandler("No user found!", StatusCodes.UNAUTHORIZED));

    const farms = await this.farmRepository.getFarmsAsync(userId);
    const serviceResponse = ServiceResponse.success<TFarm[]>("Fetched", farms);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getFarmById: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.userId;
    if (!userId)
      return next(new ErrorHandler("No user found!", StatusCodes.UNAUTHORIZED));

    const id = req.params.id;

    const farm = await this.farmRepository.getFarmByIdAsync(userId, id);

    if (!farm) return next(new ErrorHandler(`No Farm found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TFarm>("Fetched", farm);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const farmController = new FarmController();
