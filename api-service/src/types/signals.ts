import { StrategyAction } from "./strategies";

export interface Signal {
  id: number;
  strategyId: number;
  taskId: number;
  asset: string;
  marketId: number;
  producedAt?: Date | string;
  actionsTriggered?: StrategyAction[];
  metadata?: any;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateSingalOptions {
  strategyId: number;
  taskId: number;
  asset: string;
  marketId: number;
  producedAt?: Date | string;
  actionsTriggered?: StrategyAction[];
  metadata?: any;
}

export interface SearchSignalsOptions {
  ids?: number[];
  strategyIds?: number[];
  taskIds?: number[];
  assets?: string[];
  marketIds?: number[];
  from?: Date | string;
  limit?: number;
  offset?: number;
  to?: Date | string;
  order?: "ASC" | "DESC";
}
