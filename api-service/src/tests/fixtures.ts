import { 
  ActionType,
  Comprasion,
  Market, 
  Signal, 
  Strategy, 
  StrategyRuleType,
  Task,
  TaskStatus,
  TaskType,
  TimeFrameUnit
} from "../types";

export const mockMarket = (id: number, name: string): Market => ({
  id,
  name,
  url: "http://example.com",
  createdAt: new Date(),
  updatedAt: new Date()
});

export const mockStrategy = (id: number, name: string): Strategy => ({
  id,
  name,
  createdAt: new Date,
  updatedAt: new Date,
  marketId: 1,
  assets: ["BTCUSDT"],
  rules: [
    {
      type: StrategyRuleType.PERCENTAGE_CHANGE,
      comparison: Comprasion.GREATER_THAN,
      value: 1,
      timeFrame: {
        amount: 1,
        unit: TimeFrameUnit.DAYS
      }
    }
  ],
  actions: [
    {
      type: ActionType.TELEGRAM_NOTIFICATION,
      payload: {}
    }
  ],
  taskType: TaskType.ONE_TIME,
  taskSchedule: {
    startAt: Date.now()
  }
});

export const mockTask = (id: number, strategyId: number): Task => ({
  id,
  strategyId,
  createdAt: new Date(),
  updatedAt: new Date(),
  startedAt: new Date(),
  endedAt: new Date(),
  status: TaskStatus.RUNNING,
  isActive: true
});

export const mockSignal = (id: number): Signal => ({
  id,
  strategyId: id,
  taskId: id,
  asset: "BTCUSDT",
  marketId: id,
  producedAt: new Date().toISOString(),
  actionsTriggered: [],
  metadata: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
