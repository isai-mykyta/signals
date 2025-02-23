// eslint-disable-next-line import/order
import * as dotenv from "dotenv";

dotenv.config();

import { app } from "./app";
import { TasksQueue } from "./bullmq/queues";
import { TasksWorker } from "./bullmq/workers";
import { redisConfig, rmqConfig } from "./configs";
import { StrategiesConsumer } from "./consumers";
import { RmqClient } from "./rmqClient";

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const rmqClient = new RmqClient(rmqConfig);
const strategiesConsumer = new StrategiesConsumer();
const tasksQueue = new TasksQueue({ redisConnection: redisConfig });
const tasksWorker = new TasksWorker({ redisConnection: redisConfig });

const start = async () => {
  await rmqClient.connect();
  await strategiesConsumer.consumeCreationMessages();

  app.listen(HTTP_PORT, () => {
    console.log(`Tasks-engine service is running on port ${HTTP_PORT}...`);
  });
};

const stop = async () => {
  try {
    if (rmqClient.isConnected) {
      await rmqClient.close();
    }

    await tasksQueue.closeConnection();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", stop);
process.on("SIGINT", stop);

start();

export { 
  rmqClient, 
  strategiesConsumer, 
  tasksQueue,
  tasksWorker
};

