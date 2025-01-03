import { NextFunction, Request, Response } from "express";

import { QueryStringProcessor } from "../common";

export const parseQueryParams = (req: Request, _: Response, next: NextFunction) => {
  const queryStringProcessor = new QueryStringProcessor();
  req.query = queryStringProcessor.processQueries(req.query as Record<string, string>);
  next();
};
