import amqp from "amqplib";

import { RmqClientOptions } from "./types";

export class RmqClient {
  public readonly rmqUrl: string;
  public connection: amqp.Connection;
  public isConnected: boolean;

  constructor (options: RmqClientOptions) {
    this.rmqUrl = this.buildRmqUrl(options);
  }

  private handleConnectionError(error: unknown): void {
    console.error(`RMQ Connection error:`, error);
    this.isConnected = false;
  }

  private handleConnectionClose(): void {
    console.warn(`RMQ Connection closed`);
    this.isConnected = false;
  }
  
  private buildRmqUrl(options: RmqClientOptions): string {
    const { user, password, host, port } = options;
    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);
    return `amqp://${encodedUser}:${encodedPassword}@${host}:${port}`;
  }

  public async connect(): Promise<void> {
    this.connection = await amqp.connect(this.rmqUrl);
    this.connection.on("error", this.handleConnectionError);
    this.connection.on("close", this.handleConnectionClose);
    this.isConnected = true;
    console.log("RMQ connection created...");
  }

  public async close(): Promise<void> {
    await this.connection.close();
    this.isConnected = false;
    console.log(`RMQ connection closed gracefully`);
  }
}
