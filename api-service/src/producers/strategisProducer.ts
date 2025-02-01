import { Strategy } from "../types";
import { EventsProducer } from "./eventsProducer";

class StrategiesProducer extends EventsProducer {
  public createStrategyQueue = process.env.CREATE_STRATEGY_QUEUE;

  constructor () {
    super();
  }

  public async connectChannel(): Promise<void> {
    await this.connect();
    await this.channel.assertQueue(this.createStrategyQueue, { durable: true });
  }

  public async sendCreationMessage(strategy: Strategy): Promise<void> {
    if (!this.isConnected) {
      await this.connectChannel();
    }

    this.sendMessage(this.createStrategyQueue, strategy);
    console.log(`RMQ message is sent to ${this.createStrategyQueue}`, strategy);
  }
}

export const strategiesProducer = new StrategiesProducer();
