import type { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TEFM } from "./efmModel";
import { EFMRepository } from "./efmRepository";

class EFMController {
  private readonly efmRepository: EFMRepository;

  constructor(repository: EFMRepository = new EFMRepository()) {
    this.efmRepository = repository;
  }

  public addEFM: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const newData = await this.efmRepository.addEFMAsync({
      ...req.body,
    });
    const serviceResponse = ServiceResponse.success<TEFM>(
      "Created",
      newData,
      StatusCodes.CREATED
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getEFM: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.efmRepository.getEFMAsync();
    const serviceResponse = ServiceResponse.success<TEFM[]>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getEFMById: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.efmRepository.getEFMByIdAsync({
      id,
    });

    if (!data)
      return next(
        new ErrorHandler(`No Emission Factor Master found with the id ${id}`)
      );

    const serviceResponse = ServiceResponse.success<TEFM>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteEFM: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.efmRepository.deleteEFMAsync(id);

    if (!data)
      return next(
        new ErrorHandler(`No Emission Factor Master found with the id ${id}`)
      );

    const serviceResponse = ServiceResponse.success<TEFM>("Deleted", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateEF: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.efmRepository.updateEFMAsync(req.body);

    if (!data)
      return next(
        new ErrorHandler(
          `No Emission Factor Master found with the id ${req.body._id}`
        )
      );

    const serviceResponse = ServiceResponse.success<TEFM>("Updated", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const efmController = new EFMController();
