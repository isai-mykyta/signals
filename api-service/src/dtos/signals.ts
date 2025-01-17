import { Signal, StrategyAction } from "../types";

export class SignalsDto {
  /**
  * Unique ID of the signal
  * @example 123
  */
  public id: number;

  /**
  * Unique ID of the assosiated strategy
  * @example 123
  */
  public strategyId: number;

  /**
  * Unique ID of the assosiated task
  * @example 123
  */
  public taskId: number;

  /**
  * Asset for which the signal was produced
  * @example BTCUSDT
  */
  public asset: string;

  /**
  * Unique ID of the assosiated market
  * @example 123
  */
  public marketId: number;

  /**
  * Market creation date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */

  /**
  * Signal producing date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public producedAt: string | Date | null;

  /**
   * Actions triggered by signal
   */
  public actionsTriggered: StrategyAction[] | null;

  /**
   * Any metadata
   */
  public metadata: any;

  /**
  * Signal creation date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public createdAt: Date | string;

  /**
  * Last signal update date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
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
