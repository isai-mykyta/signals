import fs from "fs";
import path from "path";

import { Sequelize } from "sequelize-typescript";
import { StartedTestContainer , GenericContainer} from "testcontainers";
import { Umzug, SequelizeStorage } from "umzug";

import { sequelizeConfig } from "../configs/sequelize";

export const CONSTANTS = {
  POSTGRES_USER: "test-user",
  POSTGRES_PASSWORD: "test-password",
  POSTGRES_DB: "signals_service",
  RABBITMQ_PASSWORD: "guest",
  RABBITMQ_USER: "guest",
  CREATE_STRATEGY_QUEUE: "create_strategy_queue"
};

export const startTestPgContainer = async (): Promise<StartedTestContainer> => {
  return await new GenericContainer("postgres")
    .withEnvironment(CONSTANTS)
    .withExposedPorts(5432)
    .withHealthCheck({
      test: ["CMD-SHELL", "pg_isready -U test-user"],
      interval: 1000,
      timeout: 500,
      retries: 5,
    })
    .start();
};

export const startTestRmqContainer = async (): Promise<StartedTestContainer> => {
  return await new GenericContainer("rabbitmq:3-management")
    .withExposedPorts(5672, 15672)
    .start();
};

export const runMigrations = async (sequelize: Sequelize): Promise<void> => {
  const migrator = new Umzug({
    migrations: {
      glob: path.resolve(__dirname, "../migrations"),
    },
    storage: new SequelizeStorage({ sequelize }),
    context: sequelize.getQueryInterface(),
    logger: console,
  });

  console.log("Running migrations...");
  await migrator.up();
  console.log("Migrations completed.");
};


export default async function globalSetup() {
  console.log("[globalSetup] Starting Postgres container...");
  
  const pgContainer: StartedTestContainer = await startTestPgContainer();
  const pgHost = pgContainer.getHost();
  const pgPort = pgContainer.getMappedPort(5432);

  process.env.POSTGRES_HOST = pgHost;
  process.env.POSTGRES_PORT = pgPort.toString();
  process.env.POSTGRES_USER = CONSTANTS.POSTGRES_USER;
  process.env.POSTGRES_PASSWORD = CONSTANTS.POSTGRES_PASSWORD;
  process.env.POSTGRES_DB = CONSTANTS.POSTGRES_DB;

  console.log("[globalSetup] Starting RabbitMQ container...");

  const rmqContainer: StartedTestContainer = await startTestRmqContainer();
  const rmqHost = rmqContainer.getHost();
  const rmqPort = rmqContainer.getMappedPort(5672);

  process.env.RABBITMQ_HOST = rmqHost;
  process.env.RABBITMQ_PORT = rmqPort.toString();
  process.env.RABBITMQ_PASSWORD = CONSTANTS.RABBITMQ_PASSWORD;
  process.env.RABBITMQ_USER = CONSTANTS.RABBITMQ_USER;
  process.env.CREATE_STRATEGY_QUEUE = CONSTANTS.CREATE_STRATEGY_QUEUE;

  console.log("[globalSetup] Running migrations...");

  const sequelize = new Sequelize({
    ...sequelizeConfig,
    host: pgHost,
    port: Number(pgPort),
    username: CONSTANTS.POSTGRES_USER,
    password: CONSTANTS.POSTGRES_PASSWORD,
    database: CONSTANTS.POSTGRES_DB,
    logging: false,
  });

  await runMigrations(sequelize);
  await sequelize.sync({ force: true });
  await sequelize.close();

  const globalConfigPath = path.resolve(__dirname, "globalConfig.json");

  fs.writeFileSync(
    globalConfigPath,
    JSON.stringify({
      pgContainerId: pgContainer.getId(),
      rmqContainerId: rmqContainer.getId()
    })
  );

  console.log("[globalSetup] Container started and migrations complete.");
}
