import amqp from "amqplib";

import { RmqClient } from "../rmqClient";

export abstract class EventsProducer {
  public isConnected: boolean = false;
  protected channel: amqp.Channel | null = null;

  constructor () {}

  protected handleChannelError(error: unknown): void {
    console.error(`RMQ channel error:`, error);
  }

  protected handleChannelClose(): void {
    console.warn(`RMQ channel closed`);
    this.isConnected = false;
  }

  public async connect(rmqClient: RmqClient): Promise<void> {
    this.channel = await rmqClient.connection.createChannel();
    
    this.channel.on("error", this.handleChannelError.bind(this));
    this.channel.on("close", this.handleChannelClose.bind(this));
  
    this.isConnected = true;
    console.log(`RMQ channel connected to RMQ`);
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.isConnected = false;
      console.log(`RMQ channel closed gracefully`);
    }
  }

  public sendMessage<Message>(queue: string, message: Message, options: amqp.Options.Publish = {}): void {
    if (!this.isConnected) {
      console.error(`RMQ can't send message when queue is not connected`);
      return;
    }

    const msgBuffer = Buffer.from(JSON.stringify(message));
    const sendOptions = { persistent: true, ...options };
    this.channel.sendToQueue(queue, msgBuffer, sendOptions);
  }
}
