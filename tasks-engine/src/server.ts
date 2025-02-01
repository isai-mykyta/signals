// eslint-disable-next-line import/order
import * as dotenv from "dotenv";

dotenv.config();

import { app } from "./app";
import { rmqClient } from "./rmqClient";

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const start = () => {
  app.listen(HTTP_PORT, () => {
    console.log(`Tasks-engine service is running on port ${HTTP_PORT}...`);
  });
};

const stop = async () => {
  try {
    if (rmqClient.isConnected) {
      await rmqClient.close();
    }

    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", stop);
process.on("SIGINT", stop);

start();

