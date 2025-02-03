export enum StrategyRuleType {
  PERCENTAGE_CHANGE = "PERCENTAGE_CHANGE",
}

export enum ActionType {
  TELEGRAM_NOTIFICATION = "TELEGRAM_NOTIFICATION",
}

export enum TimeFrameUnit {
  SECONDS = "SECONDS",
  MINUTES = "MINUTES",
  HOURS = "HOURS",
  DAYS = "DAYS",
}

export enum TaskType {
  ONE_TIME = "ONE_TIME",
  CONTINUOUS = "CONTINUOUS",
}

export enum Comprasion {
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
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

export interface TaskSchedule {
  startAt?: number;
  endAt?: number;
}

export interface TelegramNotification {
  type: ActionType.TELEGRAM_NOTIFICATION;
  payload: any;
}

export type StrategyRule = PricePercentageChangeRule;
export type StrategyAction = TelegramNotification;

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
