import { ApplicationError } from "../common";
import { StrategiesRepository, TasksRepository } from "../repositories";
import { CustomErrorType, SearchTasksOptions, Strategy, Task, TaskStatus } from "../types";

export class TasksService {
  private tasksRepository = new TasksRepository();
  private strategiesRepository = new StrategiesRepository();

  public async createOneTimeTask(task: Partial<Task>, strategy: Strategy): Promise<Task> {
    const taskSchedule = strategy.taskSchedule;

    if (taskSchedule) {
      const shouldStartNow = taskSchedule.startAt && taskSchedule.startAt <= Date.now();
      const shouldEndNow = taskSchedule.endAt && taskSchedule.endAt <= Date.now();

      if (shouldStartNow && !shouldEndNow) {
        return this.tasksRepository.createTask({
          ...task,
          startedAt: new Date().toISOString(),
          endedAt: null,
          status: TaskStatus.RUNNING,
          isActive: true,
        });
      }

      if (shouldEndNow) {
        return this.tasksRepository.createTask({
          ...task,
          startedAt: null,
          endedAt: new Date().toISOString(),
          status: TaskStatus.COMPLETED,
          isActive: false,
        });
      }

      return this.tasksRepository.createTask({
        ...task,
        startedAt: null,
        endedAt: null,
        status: TaskStatus.PENDING,
        isActive: false,
      });
    }

    return this.tasksRepository.createTask({
      ...task,
      startedAt: new Date().toISOString(),
      endedAt: null,
      status: TaskStatus.RUNNING,
      isActive: true,
    });
  }

  public async createTask(options: Partial<Task>): Promise<Task> {
    const strategy = await this.strategiesRepository.getStrategyById(options.strategyId);

    if (!strategy) {
      throw new ApplicationError({
        message: "Invalid strategy id.",
        type: CustomErrorType.VALIDATION_ERROR
      });
    }

    return this.tasksRepository.createTask(options);
  }

  public async getTaskById(id: number): Promise<Task> {
    return this.tasksRepository.getTaskById(id);
  }
    
  public async searchTasks(options: SearchTasksOptions, order: "ASC" | "DESC" = "DESC"): Promise<Task[]> {
    return this.tasksRepository.searchTasks(options, order);
  }
    
  public async deleteTaskById(id: number): Promise<void> {
    await this.tasksRepository.deleteTaskById(id);
  }
    
  public async updateTaskById(id: number, options: Partial<Task>): Promise<void> {
    await this.tasksRepository.updateTaskById(id, options);
  }
}
