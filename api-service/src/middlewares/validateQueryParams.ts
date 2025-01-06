import { Request, Response, NextFunction } from "express";

import { validateData } from "./validateData";

export const validateQueryParams = (validator: any) => {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    await validateData(validator, req.query, next);
    next();
  };
};
