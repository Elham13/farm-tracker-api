import type { NextFunction, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { EnhancedRequest } from "@/common/utils/type";
import type { TDoc, TGetDocsInput } from "./docsModel";
import { DocsRepository } from "./docsRepository";

class DocsController {
  private readonly docsRepository: DocsRepository;

  constructor(repository: DocsRepository = new DocsRepository()) {
    this.docsRepository = repository;
  }

  public addDoc: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    const docUri = req.file?.buffer.toString("base64");

    const newData = await this.docsRepository.addDocAsync({
      ...req.body,
      docUri: docUri ? `data:${req?.file?.mimetype};base64,${docUri}` : "",
    });
    const serviceResponse = ServiceResponse.success<TDoc>(
      "Created",
      newData,
      StatusCodes.CREATED
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getDocs: RequestHandler = async (
    req: EnhancedRequest,
    res: Response
  ) => {
    const data = await this.docsRepository.getDocsAsync(
      req.query as TGetDocsInput
    );
    const serviceResponse = ServiceResponse.success<TDoc[]>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getDocById: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.docsRepository.getDocByIdAsync({
      id,
    });

    if (!data) return next(new ErrorHandler(`No Doc found with the id ${id}`));

    const serviceResponse = ServiceResponse.success<TDoc>("Fetched", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteDoc: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    const data = await this.docsRepository.deleteDocAsync(id);

    if (!data)
      return next(
        new ErrorHandler(`No Operations Master found with the id ${id}`)
      );

    const serviceResponse = ServiceResponse.success<TDoc>("Deleted", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateDoc: RequestHandler = async (
    req: EnhancedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.docsRepository.updateDocAsync(req.body);

    if (!data)
      return next(new ErrorHandler(`No Doc found with the id ${req.body._id}`));

    const serviceResponse = ServiceResponse.success<TDoc>("Updated", data);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const docsController = new DocsController();
