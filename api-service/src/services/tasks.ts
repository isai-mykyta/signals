import { ApplicationError } from "../common";
import { StrategiesRepository, TasksRepository } from "../repositories";
import { CustomErrorType, SearchTasksOptions, Task, TaskStatus } from "../types";

export class TasksService {
  private tasksRepository = new TasksRepository();
  private strategiesRepository = new StrategiesRepository();

  public async createTask(task: Partial<Task>): Promise<Task> {
    const strategy = await this.strategiesRepository.getStrategyById(task.strategyId);

    if (!strategy) {
      throw new ApplicationError({
        type: CustomErrorType.VALIDATION_ERROR,
        message: "Invalid strategy id."
      });
    }

    const taskData: Partial<Task> = { ...task };
    const nowTimestamp = Date.now();
    const now = new Date();

    const startAt = strategy.taskSchedule?.startAt;
    const endAt = strategy.taskSchedule?.endAt;

    const shouldEndNow = endAt !== undefined && endAt <= nowTimestamp;
    const shouldStartNow = startAt !== undefined && startAt <= nowTimestamp && !shouldEndNow;
    const shouldStartLater = startAt !== undefined && startAt > nowTimestamp && !shouldEndNow;

    if (shouldStartNow) {
      taskData.startedAt = now.toISOString();
      taskData.status = TaskStatus.RUNNING;
      taskData.isActive = true;
    } else if (shouldEndNow) {
      taskData.startedAt = now.toISOString();
      taskData.endedAt = now.toISOString();
      taskData.status = TaskStatus.COMPLETED;
      taskData.isActive = false;
    } else if (shouldStartLater) {
      taskData.status = TaskStatus.PENDING;
      taskData.isActive = false;
    } else {
      taskData.status = TaskStatus.RUNNING;
      taskData.isActive = true;
    }

    return await this.tasksRepository.createTask(taskData);
  }

  public async getTaskById(id: number): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(id);

    if (!task) {
      throw new ApplicationError({
        type: CustomErrorType.NOT_FOUND,
        message: "Task not found."
      });
    }

    return task;
  }

  public async deleteTaskById(id: number): Promise<void> {
    await this.getTaskById(id);
    await this.tasksRepository.deleteTaskById(id);
  }

  public async searchTasks(options: SearchTasksOptions, order: "ASC" | "DESC" = "DESC"): Promise<Task[]> {
    return this.tasksRepository.searchTasks(options, order);
  }

  public async updateTaskById(id: number, options: Partial<Task>): Promise<void> {
    await this.getTaskById(id);
    await this.tasksRepository.updateTaskById(id, options);
  }

  public async logTaskSignal(taskId: number): Promise<void> {
    await this.updateTaskById(taskId, { lastSignalAt: new Date().toISOString() });
  }

  public async runTaskById(id: number): Promise<void> {
    await this.updateTaskById(id, {
      startedAt: new Date().toISOString(),
      status: TaskStatus.RUNNING,
      isActive: true,
    });
  }

  public async completeTaskById(id: number): Promise<void> {
    await this.updateTaskById(id, {
      endedAt: new Date().toISOString(),
      status: TaskStatus.COMPLETED,
      isActive: false,
    });
  }

  public async stopTaskById(id: number): Promise<void> {
    await this.updateTaskById(id, {
      endedAt: new Date().toISOString(),
      status: TaskStatus.STOPPED,
      isActive: false,
    });
  }
}
