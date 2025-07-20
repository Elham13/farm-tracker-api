import type { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TOperationsMaster } from "./operationsMasterModel";
import { OperationsMasterRepository } from "./operationsMasterRepository";

class OperationMasterController {
  private readonly operationsMasterRepository: OperationsMasterRepository;

  constructor(
    repository: OperationsMasterRepository = new OperationsMasterRepository()
  ) {
    this.operationsMasterRepository = repository;
  }

  public addOperationMaster: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    const newData =
      await this.operationsMasterRepository.addOperationsMasterAsync(req.body);
    const serviceResponse = ServiceResponse.success<TOperationsMaster>(
      "Created",
      newData,
      StatusCodes.CREATED
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getOperationMasters: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const data =
      await this.operationsMasterRepository.getOperationsMastersAsync(
        req.query.cropId as string
      );
    const serviceResponse = ServiceResponse.success<TOperationsMaster[]>(
      "Fetched",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getOperationMasterById: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const cropId = req.query?.cropId as string;

    const data =
      await this.operationsMasterRepository.getOperationsMasterByIdAsync({
        id,
        cropId,
      });

    if (!data)
      return next(
        new ErrorHandler(`No OperationMaster found with the id ${id}`)
      );

    const serviceResponse = ServiceResponse.success<TOperationsMaster>(
      "Fetched",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const operationMasterController = new OperationMasterController();
