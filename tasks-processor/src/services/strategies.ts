import { tasksQueue } from "../server";
import { Strategy } from "../types";
import { TasksService } from "./tasks";

export class StrategiesService {
  private readonly tasksService = new TasksService();

  public async processStrategy(strategy: Strategy): Promise<void> {
    if (!strategy.isActive) {
      return;
    }
    
    const task = await this.tasksService.createTask({ strategyId: strategy.id });
    await tasksQueue.upsertTasksJobScheduler(task);
  }
}
