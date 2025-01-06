import { Op } from "sequelize";

import { TaskModel } from "../models";
import { SearchTasksOptions, Task } from "../types";
import { Repository } from "./repository";

export class TasksRepository extends Repository {
  constructor() {
    super();
  }

  public async createTask(options: Partial<Task>): Promise<Task> {
    const task = await TaskModel.create(options);
    return task.dataValues;
  }

  public async getTaskById(id: number): Promise<Task | undefined> {
    const strategy = await TaskModel.findOne({ where: { id } });
    return strategy?.dataValues;
  }

  public async deleteTaskById(id: number): Promise<void> {
    await TaskModel.destroy({ where: { id } });
  }
    
  public async updateTaskById(id: number, options: Partial<Task>): Promise<void> {
    await TaskModel.update(options, { where: { id } });
  }

  public async searchTasks(options: SearchTasksOptions, order: "ASC" | "DESC" = "DESC"): Promise<Task[]> {
    const { 
      ids, 
      strategyIds, 
      from, 
      to, 
      limit = 20, 
      offset = 0, 
      startedAtFrom, 
      endedAtFrom, 
      lastSignalAtFrom, 
      statuses, 
      isActive 
    } = options;

    const where: Record<string, any> = {};
  
    if (from || to) {
      where.createdAt = this.buildDateRangeFilter({ from, to });
    }

    if (startedAtFrom) {
      where.startedAt = this.buildDateRangeFilter({ from: startedAtFrom });
    }

    if (endedAtFrom) {
      where.endedAt = this.buildDateRangeFilter({ from: endedAtFrom });
    }

    if (lastSignalAtFrom) {
      where.lastSignalAt = this.buildDateRangeFilter({ from: lastSignalAtFrom });
    }

    if (ids && ids.length > 0) {
      where.id = { [Op.in]: ids };
    }

    if (strategyIds && strategyIds.length > 0) {
      where.strategyId = { [Op.in]: strategyIds };
    }

    if (statuses && statuses.length > 0) {
      where.status = { [Op.in]: statuses };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }
  
    const results = await TaskModel.findAll({
      where,
      order: [["createdAt", order]],
      limit,
      offset,
    });
      
    return results.map((result) => result.dataValues);
  }
}
