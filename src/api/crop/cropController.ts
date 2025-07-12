import { NextFunction, RequestHandler, Response } from "express";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { EnhancedRequest } from "@/common/utils/type";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { StatusCodes } from "http-status-codes";
import { CropRepository } from "./cropRepository";
import { TCrop } from "./cropModel";

class CropController {
  private readonly cropRepository: CropRepository;

  constructor(repository: CropRepository = new CropRepository()) {
    this.cropRepository = repository;
  }

  public addCrop: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.userId;
    if (!userId)
      return next(new ErrorHandler("No user found!", StatusCodes.UNAUTHORIZED));

    const crop = await this.cropRepository.addCropAsync({
      ...req.body,
      user: userId,
    });
    const serviceResponse = ServiceResponse.success<TCrop>(
      "Created",
      crop,
      StatusCodes.CREATED
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getCrops: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const farms = await this.cropRepository.getCropsAsync(
      req.query.farmId as string
    );
    const serviceResponse = ServiceResponse.success<TCrop[]>("Fetched", farms);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getCropById: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const farmId = req.query?.farmId as string;

    const crop = await this.cropRepository.getCropByIdAsync({
      id,
      farmId,
    });

    if (!crop) return next(new ErrorHandler(`No Crop found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TCrop>("Fetched", crop);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const cropController = new CropController();
