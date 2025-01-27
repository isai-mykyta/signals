import { Strategy } from "../types";
import { EventsProducer } from "./eventsProducer";

export class StrategiesProducer extends EventsProducer {
  public createStrategyQueue = process.env.CREATE_STRATEGY_QUEUE;

  constructor () {
    super({ name: "StrategiesProducer" });
  }

  public async connectChannel(): Promise<void> {
    await this.connect();
    await this.channel.assertQueue(this.createStrategyQueue, { durable: true });
  }

  public async sendCreationMessage(strategy: Strategy): Promise<void> {
    if (!this.isConnected) {
      await this.connectChannel();
    }

    this.sendMessage(strategy);
  }
}
