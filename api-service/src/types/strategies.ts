export enum TaskType {
  ONE_TIME = "ONE_TIME",
  CONTINUOUS = "CONTINUOUS",
}

export enum StrategyRuleType {
  PERCENTAGE_CHANGE = "PERCENTAGE_CHANGE",
}

export enum Comprasion {
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
}

export enum TimeFrameUnit {
  SECONDS = "SECONDS",
  MINUTES = "MINUTES",
  HOURS = "HOURS",
  DAYS = "DAYS",
}

export enum ActionType {
  TELEGRAM_NOTIFICATION = "TELEGRAM_NOTIFICATION",
}

export interface PricePercentageChangeRule {
  type: StrategyRuleType.PERCENTAGE_CHANGE;
  comparison: Comprasion;
  value: number;
  timeFrame: TimeFrame;
}

export interface TimeFrame {
  amount: number;
  unit: TimeFrameUnit;
}

export interface TelegramNotification {
  type: ActionType.TELEGRAM_NOTIFICATION;
  payload: any;
}

export interface TaskSchedule {
  startAt?: number;
  endAt?: number;
}

export interface Strategy {
  id: number;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  marketId: number;
  assets: string[];
  rules: StrategyRule[];
  actions: StrategyAction[];
  taskType: TaskType;
  isActive: boolean;
  taskSchedule?: TaskSchedule;
}

export interface CreateStrategyOptions {
  name: string;
  marketId: number;
  assets: string[];
  rules: StrategyRule[];
  actions: StrategyAction[];
  taskType: TaskType;
  taskSchedule?: TaskSchedule;
}

export interface SearchStrategiesOptions {
  ids?: number[];
  names?: string[];
  from?: Date | string;
  limit?: number;
  offset?: number;
  to?: Date | string;
  marketIds?: number[];
  isActive?: boolean;
  assets?: string[];
  order?: "ASC" | "DESC";
}

export type StrategyRule = PricePercentageChangeRule;
export type StrategyAction = TelegramNotification;
