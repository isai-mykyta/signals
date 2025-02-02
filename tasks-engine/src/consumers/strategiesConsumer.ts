import { rmqClient } from "../server";
import { StrategiesService } from "../services";
import { EventsConsumer } from "./eventsConsumer";

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
    if (!this.isConnected) {
      await this.connectChannel();
    }

    this.channel.consume(this.createStrategyQueue, (message) => {
      if (message) {
        const messageString = message.content.toString("utf-8");
        const messagePayload = JSON.parse(messageString);
        
        this.strategiesService.processStrategy(messagePayload);
        this.channel.ack(message);
      }
    });
  }
}
