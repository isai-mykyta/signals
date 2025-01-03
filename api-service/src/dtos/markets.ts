import { Market } from "../types";

export class MarketResponseDto {
  public id: number;
  public name: string;
  public url: string;
  public createdAt: string;
  public updatedAt: string;

  constructor (data: Market) {
    Object.assign(this, data);
    this.createdAt = new Date(data.createdAt).toISOString();
    this.updatedAt = new Date(data.updatedAt).toISOString();
  }
}
