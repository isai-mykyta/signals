import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

import { ApplicationError } from "../common";
import { CustomErrorType, HttpStatusCode } from "../types";

export const errorHandler: ErrorRequestHandler = (err: ApplicationError | Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err);

  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json(err.getErrorData()); 
    return; 
  }

  // support for tsoa validation errors
  if (err instanceof ValidateError) {
    const applicationError = new ApplicationError({
      message: err.message,
      type: CustomErrorType.VALIDATION_ERROR,
      statusCode: HttpStatusCode.BAD_REQUEST,
      details: err.fields,
    });
    res.status(applicationError.statusCode).json(applicationError.getErrorData()); 
  }

  res.status(HttpStatusCode.INTERNAL_ERROR).json({ message: "Internal Server Error"});
  return; 
};
