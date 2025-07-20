import type { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TFarm } from "./farmModel";
import { FarmRepository } from "./farmRepository";

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

  public deleteFarm: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.farmRepository.deleteFarmAsync(id);

    if (!data) return next(new ErrorHandler(`No Farm found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TFarm>("Deleted", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateFarm: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.farmRepository.updateFarmAsync(req.body);

    if (!data)
      return next(
        new ErrorHandler(`No Farm found with the id ${req.body._id}`)
      );

    const serviceResponse = ServiceResponse.success<TFarm>("Updated", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const farmController = new FarmController();
