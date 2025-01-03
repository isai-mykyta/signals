import { Op } from "sequelize";

import { ApplicationError } from "../common";
import { MarketModel } from "../models";
import { CustomErrorType, Market, SearchMarketsOptions } from "../types";
import { Repository } from "./repository";

export class MarketsRepository extends Repository {
  constructor() {
    super();
  }

  public async createMarket(options: Partial<Market>): Promise<Market> {
    const market = await MarketModel.create(options);
    return market.dataValues;
  }

  public async getMarketById(id: number): Promise<Market | undefined> {
    const market = await MarketModel.findOne({ where: { id } });
    return market?.dataValues;
  }

  public async searchMarkets(options: SearchMarketsOptions, order: "ASC" | "DESC" = "DESC"): Promise<Market[]> {
    const { ids, names, url, from, to, limit = 20, offset = 0 } = options;
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

    if (url) {
      where.url = url;
    }

    const results = await MarketModel.findAll({
      where,
      order: [["createdAt", order]],
      limit,
      offset,
    });

    return results.map((result) => result.dataValues);
  }

  public async deleteMarketById(id: number): Promise<void> {
    await MarketModel.destroy({ where: { id } });
  }

  public async updateMarketById(id: number, options: Partial<Market>): Promise<void> {
    await MarketModel.update(options, { where: { id } });
  }
}
