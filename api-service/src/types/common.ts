import { Op } from "sequelize";

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  INTERNAL_ERROR = 500,
  NOT_FOUND = 404,
}

export enum CustomErrorType {
  VALIDATION_ERROR,
  NOT_FOUND,
}

export interface BuildDateRangeFilterOptions {
  from?: Date | string;
  to?: Date | string;
}

export interface DateRangeFilter {
  [Op.gte]?: Date | string;
  [Op.lte]?: Date | string;
};
