import amqp from "amqplib";

import { EventsProducerOptions } from "../types";

export abstract class EventsProducer {
  protected readonly rmqUrl: string;
  protected isConnected: boolean;
  public readonly queueName: string;
  protected connection: amqp.Connection;
  protected channel: amqp.Channel;

  constructor (options: EventsProducerOptions) {
    this.rmqUrl = this.buildRmqUrl(options);
  }

  protected buildRmqUrl(options: Omit<EventsProducerOptions, "queueName">): string {
    const { user, password, host, port } = options;
    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);
    return `amqp://${encodedUser}:${encodedPassword}@${host}:${port}`;
  }

  protected handleConnectionError(error: unknown): void {
    console.error(`${this.queueName} Connection error:`, error);
    this.isConnected = false;
  }

  protected handleConnectionClose(): void {
    console.warn(`${this.queueName} Connection closed`);
    this.isConnected = false;
  }

  protected handleChannelError(error: unknown): void {
    console.error(`${this.queueName} Channel error:`, error);
  }

  protected handleChannelClose(): void {
    console.warn(`${this.queueName} Channel closed`);
  }

  public async connect(): Promise<void> {
    this.connection = await amqp.connect(this.rmqUrl);

    this.connection.on("error", this.handleConnectionError);
    this.connection.on("close", this.handleConnectionClose);
  
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  
    this.channel.on("error", this.handleChannelError);
    this.channel.on("close", this.handleChannelClose);
  
    this.isConnected = true;
    console.log(`${this.queueName} Connected to RabbitMQ`);
  }

  public async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
    this.isConnected = false;
    console.log(`${this.queueName} Connection closed gracefully`);
  }

  public async sendMessage<Message>(message: Message, options: amqp.Options.Publish = {}): Promise<void> {
    if (!this.isConnected) {
      console.error(`${this.queueName} Can't send message when queue is not connected`);
      return;
    }

    const msgBuffer = Buffer.from(JSON.stringify(message));
    const sendOptions = { persistent: true, ...options };
    this.channel.sendToQueue(this.queueName, msgBuffer, sendOptions);
  }
}
