import { Market } from "../types";

export class MarketResponseDto {
  /**
  * Unique ID of the market
  * @example 123
  */
  public id: number;

  /**
  * Market name
  * @example Binance Futures
  */
  public name: string;

  /**
  * Market url
  * @example https://www.binance.com/en/futures/BTCUSDT
  */
  public url: string;

  /**
  * Market creation date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public createdAt: string;

  /**
  * Last market update date in ISO format
  * @example 2025-01-17T15:25:35.751Z
  */
  public updatedAt: string;

  constructor (data: Market) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt).toISOString();
    this.updatedAt = new Date(data.updatedAt).toISOString();
  }
}
