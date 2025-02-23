import { Job, Queue } from "bullmq";
import { RedisOptions } from "ioredis";

import { AddJobOptions, AddRepeatedJobOptions, QueueProviderOptions } from "../../types";

export abstract class QueueProvider {
  public readonly queueName: string;
  protected readonly redisConnection: RedisOptions;
  protected readonly queue: Queue;

  constructor (options: QueueProviderOptions) {
    this.queueName = options.queueName;
    this.redisConnection = options.redisConnection;
    this.queue = new Queue(options.queueName, { connection: options.redisConnection });
  }

  protected async addJob<Data>(options: AddJobOptions<Data>): Promise<Job<Data>> {
    return await this.queue.add(options.name, options.data, options.opts);
  }

  protected async upsertJobScheduler<Data>(options: AddRepeatedJobOptions<Data>): Promise<Job<Data>> {
    return await this.queue.upsertJobScheduler(
      options.schedulerId, 
      options.repeatOptions,
      {
        name: options.jobName,
        data: options.data,
        opts: options.opts
      }
    );
  }

  public async closeConnection(): Promise<void> {
    await this.queue.close();
  }
}
