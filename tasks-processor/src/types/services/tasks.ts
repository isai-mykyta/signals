export enum TaskStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  STOPPED = "STOPPED"
}

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
