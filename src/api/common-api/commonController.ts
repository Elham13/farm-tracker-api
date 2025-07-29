import type { RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import { CommonRepository } from "./commonRepository";

class CommonController {
  private readonly commonRepository: CommonRepository;

  constructor(repository: CommonRepository = new CommonRepository()) {
    this.commonRepository = repository;
  }

  public initializeEmissionFactors: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    await this.commonRepository.initializeEmissionFactors();
    const serviceResponse = ServiceResponse.success<null>(
      "Done",
      null,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const commonController = new CommonController();
