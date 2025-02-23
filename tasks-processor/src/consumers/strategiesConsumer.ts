import { rmqClient } from "../server";
import { StrategiesService } from "../services";
import { EventsConsumer } from "./eventsConsumer";
import { Strategy } from "../types";

export class StrategiesConsumer extends EventsConsumer {
  public createStrategyQueue = process.env.CREATE_STRATEGY_QUEUE;
  private readonly strategiesService = new StrategiesService();

  constructor () {
    super();
  }

  public async connectChannel(): Promise<void> {
    await this.connect(rmqClient);
    await this.channel.assertQueue(this.createStrategyQueue, { durable: true });
  }

  async consumeCreationMessages(): Promise<void> {
    if (!this.isConnected) await this.connectChannel();

    this.channel.consume(this.createStrategyQueue, (message) => {
      if (message) {
        const messagePayload = this.parseConsumeMessage<Strategy>(message);
        this.strategiesService.processStrategy(messagePayload);
        this.channel.ack(message);
      }
    });
  }
}
