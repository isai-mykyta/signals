import { Task, TaskStatus } from "../types";

export class TasksDto {
  public id: number;
  public strategyId: number;
  public createdAt: string | Date;
  public updatedAt: string | Date;
  public startedAt: string | Date;
  public endedAt: string | Date;
  public lastSignalAt?: string | Date;
  public status: TaskStatus;
  public isActive: boolean;

  constructor (data: Task) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt).toISOString();
    this.updatedAt = new Date(data.updatedAt).toISOString();
    this.startedAt = new Date(data.startedAt).toISOString();
    this.endedAt = new Date(data.endedAt).toISOString();
    this.lastSignalAt = new Date(data.lastSignalAt).toISOString();
  }
}
