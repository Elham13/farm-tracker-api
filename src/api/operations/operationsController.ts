import type { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TOperations } from "./operationsModel";
import { OperationsRepository } from "./operationsRepository";

class OperationsController {
  private readonly operationsRepository: OperationsRepository;

  constructor(repository: OperationsRepository = new OperationsRepository()) {
    this.operationsRepository = repository;
  }

  public addOperation: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const newData = await this.operationsRepository.addOperationsAsync({
      ...req.body,
    });
    const serviceResponse = ServiceResponse.success<TOperations>(
      "Created",
      newData,
      StatusCodes.CREATED
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getOperations: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.operationsRepository.getOperationsAsync(
      req.query.masterId as string
    );
    const serviceResponse = ServiceResponse.success<TOperations[]>(
      "Fetched",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getOperationById: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.operationsRepository.getOperationsByIdAsync({
      id,
    });

    if (!data)
      return next(new ErrorHandler(`No Operation found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TOperations>(
      "Fetched",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteOperation: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.operationsRepository.deleteOperationAsync(id);

    if (!data)
      return next(new ErrorHandler(`No Operations found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TOperations>(
      "Deleted",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateOperations: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.operationsRepository.updateOperationAsync(req.body);

    if (!data)
      return next(
        new ErrorHandler(`No Operations found with the id ${req.body._id}`)
      );

    const serviceResponse = ServiceResponse.success<TOperations>(
      "Updated",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const operationsController = new OperationsController();
