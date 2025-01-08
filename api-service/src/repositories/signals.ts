import { Op } from "sequelize";

import { SignalModel } from "../models";
import { SearchSignalsOptions, Signal } from "../types";
import { Repository } from "./repository";

export class SignalsRepository extends Repository {
  constructor() {
    super();
  }

  public async createSignal(options: Partial<Signal>): Promise<Signal> {
    const signal = await SignalModel.create(options);
    return signal.dataValues;
  }

  public async getSignalById(id: number): Promise<Signal | undefined> {
    const signal = await SignalModel.findOne({ where: { id } });
    return signal?.dataValues;
  }

  public async deleteSignalById(id: number): Promise<void> {
    await SignalModel.destroy({ where: { id } });
  }
    
  public async updateSignalById(id: number, options: Partial<Signal>): Promise<void> {
    await SignalModel.update(options, { where: { id } });
  }

  public async searchSignals(options: SearchSignalsOptions, order: "ASC" | "DESC" = "DESC"): Promise<Signal[]> {
    const { from, to, limit = 20, offset = 0, ids, strategyIds, taskIds, assets, marketIds  } = options;
    const where: Record<string, any> = {};

    if (from || to) {
      where.createdAt = this.buildDateRangeFilter({ from, to });
    }

    if (ids && ids.length > 0) {
      where.id = { [Op.in]: ids };
    }

    if (strategyIds && strategyIds.length > 0) {
      where.strategyId = { [Op.in]: strategyIds };
    }

    if (taskIds && taskIds.length > 0) {
      where.taskId = { [Op.in]: taskIds };
    }

    if (marketIds && marketIds.length > 0) {
      where.marketId = { [Op.in]: marketIds };
    }

    if (assets && assets.length > 0) {
      where.asset = { [Op.in]: assets };
    }

    const signals = await SignalModel.findAll({
      where,
      order: [["createdAt", order]],
      limit,
      offset,
    });
        
    return signals.map((signal) => signal.dataValues);
  }
}
