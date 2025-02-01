import amqp from "amqplib";

import { rmqClient } from "../rmqClient";
import { EventsProducerOptions } from "../types";

export abstract class EventsProducer {
  public isConnected: boolean = false;
  public readonly name: string;
  protected connection: amqp.Connection;
  protected channel: amqp.Channel | null = null;

  constructor (options: EventsProducerOptions) {
    this.connection = rmqClient.connection;
    this.name = options.name;
  }

  protected handleChannelError(error: unknown): void {
    console.error(`${this.name} channel error:`, error);
  }

  protected handleChannelClose(): void {
    console.warn(`${this.name} channel closed`);
    this.isConnected = false;
  }

  public async connect(): Promise<void> {
    this.connection = rmqClient.connection;
    this.channel = await this.connection.createChannel();
    
    this.channel.on("error", this.handleChannelError);
    this.channel.on("close", this.handleChannelClose);
  
    this.isConnected = true;
    console.log(`${this.name} channel connected to RMQ`);
  }

  public async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.isConnected = false;
      console.log(`${this.name} channel closed gracefully`);
    }
  }

  public sendMessage<Message>(message: Message, options: amqp.Options.Publish = {}): void {
    if (!this.isConnected) {
      console.error(`${this.name} can't send message when queue is not connected`);
      return;
    }

    const msgBuffer = Buffer.from(JSON.stringify(message));
    const sendOptions = { persistent: true, ...options };
    this.channel.sendToQueue(this.name, msgBuffer, sendOptions);
  }
}
