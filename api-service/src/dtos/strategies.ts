import { 
  Strategy, 
  StrategyAction, 
  StrategyRule, 
  TaskSchedule, 
  TaskType 
} from "../types";

export class StrategiesDto {
  /**
  * Unique ID of the strategy
  * @example 123
  */
  public id: number;

  /**
  * Strategy name
  * @example MA
  */
  public name: string;

  /**
  * Strategy creation date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public createdAt: Date | string;

  /**
  * Last strategy update date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public updatedAt: Date | string;

  /**
  * Assets included into strategy
  * @example ['BTCUSDT', 'XRPETH']
  */
  public assets: string[];

  /**
  * Strategy rules
  */
  public rules: StrategyRule[];

  /**
  * Strategy actions
  */
  public actions: StrategyAction[];

  /**
  * Assosiated task type
  * @example ONE_TIME
  */
  public taskType: TaskType;

  /**
  * Schedule that defines when the assosiated task should start or end.
  */
  public taskSchedule: TaskSchedule;

  constructor (data: Strategy) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt).toISOString();
    this.updatedAt = new Date(data.updatedAt).toISOString();
  }
}
