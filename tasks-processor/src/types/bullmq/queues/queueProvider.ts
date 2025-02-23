import { JobSchedulerTemplateOptions, JobsOptions, RepeatOptions } from "bullmq";
import { RedisOptions } from "ioredis";

export interface AddRepeatedJobOptions<Data> {
  schedulerId: string;
  jobName?: string;
  data?: Data;
  repeatOptions: Omit<RepeatOptions, "key">
  opts?: JobSchedulerTemplateOptions;
}

export interface QueueProviderOptions {
  queueName: string;
  redisConnection: RedisOptions;
}

export interface AddJobOptions<Data> {
  name: string;
  data: Data;
  opts?: JobsOptions;
}
