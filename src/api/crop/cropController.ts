import type { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TCrop } from "./cropModel";
import { CropRepository } from "./cropRepository";

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

    const crop = await this.cropRepository.getCropByIdAsync({
      id,
    });

    if (!crop) return next(new ErrorHandler(`No Crop found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TCrop>("Fetched", crop);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteCrop: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const crop = await this.cropRepository.deleteCropAsync(id);

    if (!crop) return next(new ErrorHandler(`No Crop found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TCrop>("Deleted", crop);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateCrop: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const crop = await this.cropRepository.updateCropAsync(req.body);

    if (!crop)
      return next(
        new ErrorHandler(`No Crop found with the id ${req.body._id}`)
      );

    const serviceResponse = ServiceResponse.success<TCrop>("Updated", crop);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const cropController = new CropController();
