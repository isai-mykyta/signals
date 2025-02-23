import { Job } from "bullmq";
import { RedisOptions } from "ioredis";

export interface TasksWorkerOptions {
  redisConnection: RedisOptions
}
