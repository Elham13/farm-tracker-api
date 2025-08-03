import type { RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TCrop } from "../crop/cropModel";
import type { TOperations } from "../operations/operationsModel";
import type {
  IAggregatedMetrics,
  ICropWiseEmission,
  ICropWiseWater,
  IDashboardCount,
  IFarmer,
  IFarmersRes,
  TGetFarmersInput,
} from "./dashboardModel";
import { DashboardRepository } from "./dashboardRepository";

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

  public getAggregatedMetrics: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.dashboardRepository.getAggregatedMetricsAsync();
    const serviceResponse = ServiceResponse.success<IAggregatedMetrics>(
      "Fetched",
      data,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getCropWiseEmissions: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.dashboardRepository.getCropWiseEmissionsAsync();
    const serviceResponse = ServiceResponse.success<ICropWiseEmission[]>(
      "Fetched",
      data,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getFarmersData: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const query = req.query as TGetFarmersInput;
    const data = await this.dashboardRepository.getFarmersDataAsync(query);
    const serviceResponse = ServiceResponse.success<IFarmersRes>(
      "Fetched",
      data,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getCropWiseWaterConsumption: RequestHandler = async (
    _req: EnhancedRequest,
    res: Response
  ) => {
    const data =
      await this.dashboardRepository.getCropWiseWaterConsumptionAsync();
    const serviceResponse = ServiceResponse.success<ICropWiseWater[]>(
      "Fetched",
      data,
      StatusCodes.OK
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const dashboardController = new DashboardController();
