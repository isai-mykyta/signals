import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { ApplicationError } from "../common";
import { HttpStatusCode } from "../types";

export const errorHandler: ErrorRequestHandler = (err: ApplicationError | Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err);

  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json(err.getErrorData()); 
    return; 
  }

  res.status(HttpStatusCode.INTERNAL_ERROR).json({ message: "Internal Server Error"});
  return; 
};
