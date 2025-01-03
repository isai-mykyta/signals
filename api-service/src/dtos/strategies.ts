import { 
  Strategy, 
  StrategyAction, 
  StrategyRule, 
  TaskSchedule, 
  TaskType 
} from "../types";

export class StrategiesDto {
  public id: number;
  public name: string;
  public createdAt: Date | string;
  public updatedAt: Date | string;
  public assets: string[];
  public rules: StrategyRule[];
  public actions: StrategyAction[];
  public taskType: TaskType;
  public taskSchedule: TaskSchedule;

  constructor (data: Strategy) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt).toISOString();
    this.updatedAt = new Date(data.updatedAt).toISOString();
  }
}
