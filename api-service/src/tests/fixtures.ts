import { 
  ActionType,
  Comprasion,
  Market, 
  Strategy, 
  StrategyRuleType,
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
