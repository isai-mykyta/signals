export interface Task {
  id: number;
  strategyId: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  startedAt: string | Date;
  endedAt: string | Date;
  lastSignalAt?: string | Date;
  status: TaskStatus;
  isActive: boolean;
}

export interface CreateTaskOptions {
  strategyId: number;
}

export enum TaskStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  STOPPED = "STOPPED"
}

export interface SearchTasksOptions {
  ids?: number[];
  strategyIds?: number[];
  startedAtFrom?: string | Date;
  endedAtFrom?: string | Date;
  lastSignalAtFrom?: string | Date;
  statuses?: TaskStatus[];
  isActive?: boolean;
  from?: Date | string;
  limit?: number;
  offset?: number;
  to?: Date | string;
  order?: "ASC" | "DESC";
}
