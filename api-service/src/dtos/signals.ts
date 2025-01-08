import { Signal, StrategyAction } from "../types";

export class SignalsDto {
  public id: number;
  public strategyId: number;
  public taskId: number;
  public asset: string;
  public marketId: number;
  public producedAt: string | Date | null;
  public actionsTriggered: StrategyAction[] | null;
  public metadata: any;
  public createdAt: Date | string;
  public updatedAt: Date | string;

  constructor (data: Signal) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt).toISOString();
    this.updatedAt = new Date(data.updatedAt).toISOString();
    this.producedAt = data.producedAt ? new Date(data.producedAt).toISOString() : null;
    this.actionsTriggered = data.actionsTriggered || null;
    this.metadata = data.metadata || null;
  }
}
