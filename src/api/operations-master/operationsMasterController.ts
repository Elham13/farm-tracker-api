import { NextFunction, RequestHandler, Response } from "express";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { EnhancedRequest } from "@/common/utils/type";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { StatusCodes } from "http-status-codes";
import { OperationsMasterRepository } from "./operationsMasterRepository";
import { TOperationsMaster } from "./operationsMasterModel";

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
    next: NextFunction
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
