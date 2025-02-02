// eslint-disable-next-line import/order
import * as dotenv from "dotenv";

dotenv.config();

import { Sequelize } from "sequelize-typescript";

import { app } from "./app";
import { rmqConfig, sequelizeConfig } from "./configs";
import { RmqClient } from "./rmqClient";

const HTTP_PORT = process.env.HTTP_PORT || 8080;

const sequelize = new Sequelize(sequelizeConfig);
const rmqClient = new RmqClient(rmqConfig);

const start = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Connected to the database.");
    
    await rmqClient.connect();

    app.listen(HTTP_PORT, () => {
      console.log(`API service is running on port ${HTTP_PORT}...`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

const stop = async () => {
  try {
    if (rmqClient.isConnected) {
      await rmqClient.close();
    }
  
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", stop);
process.on("SIGINT", stop);

start();

export { rmqClient };
