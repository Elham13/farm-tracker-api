import { NextFunction, RequestHandler, Response } from "express";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { EnhancedRequest } from "@/common/utils/type";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { StatusCodes } from "http-status-codes";
import { OperationsRepository } from "./operationsRepository";
import { TOperations } from "./operationsModel";

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
    const masterId = req.query?.masterId as string;

    const data = await this.operationsRepository.getOperationsByIdAsync({
      id,
      masterId,
    });

    if (!data)
      return next(new ErrorHandler(`No Operation found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TOperations>(
      "Fetched",
      data
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const operationsController = new OperationsController();
