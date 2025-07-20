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
      return next(
        new ErrorHandler(`No Emission Factor found with the id ${id}`)
      );

    const serviceResponse = ServiceResponse.success<TEF>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteEF: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.efRepository.deleteEFAsync(id);

    if (!data)
      return next(
        new ErrorHandler(`No Emission Factor found with the id ${id}`)
      );

    const serviceResponse = ServiceResponse.success<TEF>("Deleted", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateEF: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.efRepository.updateEFAsync(req.body);

    if (!data)
      return next(
        new ErrorHandler(`No Emission Factor found with the id ${req.body._id}`)
      );

    const serviceResponse = ServiceResponse.success<TEF>("Updated", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const efController = new EFController();
