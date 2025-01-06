import { Op } from "sequelize";

import { StrategyModel } from "../models";
import { SearchStrategiesOptions, Strategy } from "../types";
import { Repository } from "./repository";

export class StrategiesRepository extends Repository {
  constructor() {
    super();
  }
  
  public async createStrategy(options: Partial<Strategy>): Promise<Strategy> {
    const market = await StrategyModel.create(options);
    return market.dataValues;
  }

  public async getStrategyById(id: number): Promise<Strategy | undefined> {
    const strategy = await StrategyModel.findOne({ where: { id } });
    return strategy?.dataValues;
  }

  public async searchStrategies(options: SearchStrategiesOptions, order: "ASC" | "DESC" = "DESC"): Promise<Strategy[]> {
    const { ids, names, from, to, limit = 20, offset = 0, marketIds, assets  } = options;
    const where: Record<string, any> = {};

    if (from || to) {
      where.createdAt = this.buildDateRangeFilter({ from, to });
    }

    if (ids && ids.length > 0) {
      where.id = { [Op.in]: ids };
    }

    if (names && names.length > 0) {
      where.name = { [Op.in]: names };
    }

    if (marketIds && marketIds.length > 0) {
      where.marketId = { [Op.in]: marketIds };
    }

    if (assets && assets.length > 0) {
      where.assets = { [Op.contains]: assets };
    }

    const results = await StrategyModel.findAll({
      where,
      order: [["createdAt", order]],
      limit,
      offset,
    });
    
    return results.map((result) => result.dataValues);
  }

  public async deleteStrategyById(id: number): Promise<void> {
    await StrategyModel.destroy({ where: { id } });
  }
  
  public async updateStrategyById(id: number, options: Partial<Strategy>): Promise<void> {
    await StrategyModel.update(options, { where: { id } });
  }
}
