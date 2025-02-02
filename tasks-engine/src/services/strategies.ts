import { Strategy } from "../types";

export class StrategiesService {
  public async processStrategy(strategy: Strategy): Promise<void> {
    if (!strategy.isActive) {
      return;
    }
  }
}
