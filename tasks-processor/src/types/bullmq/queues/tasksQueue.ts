import { RedisOptions } from "ioredis";

export interface TasksQueueOptions {
  redisConnection: RedisOptions
}
