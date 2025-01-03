import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction } from "express";

import { ApplicationError } from "../common";
import { CustomErrorType } from "../types";

export const validateData = async (validator: any, data: any, next: NextFunction) => {
  const validatorInstance = plainToInstance(validator, data || {});
  const errors = await validate(validatorInstance);

  if (errors.length > 0) {
    const errorMessages = errors.map((error) =>
      Object.values(error.constraints || {}).join(", ")
    );

    return next(
      new ApplicationError({
        message: "Invalid payload",
        type: CustomErrorType.VALIDATION_ERROR,
        details: errorMessages,
      })
    );
  }
};
