import amqp from "amqplib";

import { rmqClient } from "../rmqClient";

export abstract class EventsConsumer {
  public isConnected: boolean = false;
  protected connection: amqp.Connection;
  protected channel: amqp.Channel | null = null;

  constructor () {
    this.connection = rmqClient.connection;
  }

  protected handleChannelError(error: unknown): void {
    console.error(`RMQ channel error:`, error);
  }

  protected handleChannelClose(): void {
    console.warn(`RMQ channel closed`);
    this.isConnected = false;
  }

  public async connect(): Promise<void> {
    this.connection = rmqClient.connection;
    this.channel = await this.connection.createChannel();
    
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
}
