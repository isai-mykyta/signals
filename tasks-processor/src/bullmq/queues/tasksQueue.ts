import { Job } from "bullmq";

import { QueueProvider } from "./queueProvider";
import { Task, TasksQueueOptions } from "../../types";

export class TasksQueue extends QueueProvider {
  constructor (options: TasksQueueOptions) {
    super({ queueName: process.env.TASKS_QUEUE, redisConnection: options.redisConnection });
  }

  public async upsertTasksJobScheduler(task: Task): Promise<Job<Task>> {
    return await this.upsertJobScheduler({
      schedulerId: task.id.toString(),
      repeatOptions: { every: 30000 },
      jobName: "repeatable-task",
      data: task,
    });
  }
}
