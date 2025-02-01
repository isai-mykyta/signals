import { EventsConsumer } from "./eventsConsumer";

class StrategiesConsumer extends EventsConsumer {
  public createStrategyQueue = process.env.CREATE_STRATEGY_QUEUE;

  constructor () {
    super();
  }

  public async connectChannel(): Promise<void> {
    await this.connect();
    await this.channel.assertQueue(this.createStrategyQueue, { durable: true });
  }

  async consumeCreationMessages(): Promise<void> {
    if (!this.isConnected) {
      await this.connectChannel();
    }

    this.channel.consume(this.createStrategyQueue, (message) => {
      try {
        if (message) {
          console.log(message);
          this.channel.ack(message);
        }
      } catch (error) {
        console.error(`Error processing message in ${this.createStrategyQueue}:`, error);
        this.channel?.nack(message);
      }
    });
  }
}

export const strategiesConsumer = new StrategiesConsumer();
