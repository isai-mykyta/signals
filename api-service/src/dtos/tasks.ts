import { Task, TaskStatus } from "../types";

export class TasksDto {
  public id: number;
  public strategyId: number;
  public createdAt: string;
  public updatedAt: string;
  public startedAt: string | undefined;
  public endedAt: string | undefined;
  public lastSignalAt?: string | undefined;
  public status: TaskStatus;
  public isActive: boolean;

  constructor (data: Task) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt).toISOString();
    this.updatedAt = new Date(data.updatedAt).toISOString();
    this.startedAt = data.startedAt ? new Date(data.startedAt).toISOString() : undefined;
    this.endedAt = data.endedAt ? new Date(data.endedAt).toISOString() : undefined;
    this.lastSignalAt = data.lastSignalAt ? new Date(data.lastSignalAt).toISOString() : undefined;
  }
}
