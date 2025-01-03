import { Op } from "sequelize";

import { BuildDateRangeFilterOptions, DateRangeFilter } from "../types";

export abstract class Repository {
  protected buildDateRangeFilter(options: BuildDateRangeFilterOptions): DateRangeFilter {
    const {from, to} = options;

    if (from && to) {
      return { [Op.gte]: from, [Op.lte]: to };
    } else if (from) {
      return { [Op.gte]: from };
    } else if (to) {
      return { [Op.lte]: to };
    }
  }
}
