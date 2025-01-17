import { Task, TaskStatus } from "../types";

export class TasksDto {
  /**
  * Unique ID of the task
  * @example 123
  */
  public id: number;

  /**
  * Unique ID of the assosiated strategy
  * @example 123
  */
  public strategyId: number;

  /**
  * Task creation date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public createdAt: string;

  /**
  * Last task update date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public updatedAt: string;

  /**
  * Start task date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public startedAt: string | undefined;

  /**
  * Finish task date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public endedAt: string | undefined;

  /**
  * Last task signal date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public lastSignalAt?: string | undefined;

  /**
  * Task status
  * @example PENDING
  */
  public status: TaskStatus;

  /**
  * Is active indicator
  * @example true
  */
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
