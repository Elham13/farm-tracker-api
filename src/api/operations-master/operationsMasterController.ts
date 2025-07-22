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
    console.log("file: ", req.file);
    if (req) return res.send("hello");
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

    const data =
      await this.operationsMasterRepository.getOperationsMasterByIdAsync({
        id,
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

  public deleteOperationsMaster: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data =
      await this.operationsMasterRepository.deleteOperationsMasterAsync(id);

    if (!data)
      return next(
        new ErrorHandler(`No Operations Master found with the id ${id}`)
      );

    const serviceResponse = ServiceResponse.success<TOperationsMaster>(
      "Deleted",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateOperationsMaster: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data =
      await this.operationsMasterRepository.updateOperationsMasterAsync(
        req.body
      );

    if (!data)
      return next(
        new ErrorHandler(
          `No Operation sMaster found with the id ${req.body._id}`
        )
      );

    const serviceResponse = ServiceResponse.success<TOperationsMaster>(
      "Updated",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const operationMasterController = new OperationMasterController();
