import type { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TEF } from "./efModel";
import { EFRepository } from "./efRepository";

class EFController {
  private readonly efRepository: EFRepository;

  constructor(repository: EFRepository = new EFRepository()) {
    this.efRepository = repository;
  }

  public addEF: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const newData = await this.efRepository.addEFAsync({
      ...req.body,
    });
    const serviceResponse = ServiceResponse.success<TEF>(
      "Created",
      newData,
      StatusCodes.CREATED
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getEF: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.efRepository.getEFAsync();
    const serviceResponse = ServiceResponse.success<TEF[]>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getEFById: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.efRepository.getEFByIdAsync({
      id,
    });

    if (!data)
      return next(new ErrorHandler(`No Operation found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TEF>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const efController = new EFController();
