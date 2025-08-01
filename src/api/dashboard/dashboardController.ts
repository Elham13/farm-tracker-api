import type { RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { IDashboardCount } from "./dashboardModel";
import { DashboardRepository } from "./dashboardRepository";
import { TOperations } from "../operations/operationsModel";
import { TCrop } from "../crop/cropModel";

class DashboardController {
  private readonly dashboardRepository: DashboardRepository;

  constructor(repository: DashboardRepository = new DashboardRepository()) {
    this.dashboardRepository = repository;
  }

  public getDashboardCounts: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.dashboardRepository.getDashboardCountsAsync();
    const serviceResponse = ServiceResponse.success<IDashboardCount>(
      "Fetched",
      data,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getAllOperations: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.dashboardRepository.getAllOperations();
    const serviceResponse = ServiceResponse.success<TOperations[]>(
      "Fetched",
      data,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getAllCrops: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.dashboardRepository.getAllCrops();
    const serviceResponse = ServiceResponse.success<TCrop[]>(
      "Fetched",
      data,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const dashboardController = new DashboardController();
