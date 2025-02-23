import { Job, Worker } from "bullmq";

import { Task, TasksWorkerOptions } from "../../types";

export class TasksWorker {
  public readonly queueName: string;
  protected readonly worker: Worker;
  
  constructor (options: TasksWorkerOptions) {
    this.queueName = process.env.TASKS_QUEUE;
    this.worker = new Worker(process.env.TASKS_QUEUE, this.handleTask, { connection: options.redisConnection });
  }

  private async handleTask(job: Job<Task>) {
    console.log(job);
  }
}
