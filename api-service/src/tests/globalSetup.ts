import fs from "fs";
import path from "path";

import { Sequelize } from "sequelize-typescript";
import { StartedTestContainer , GenericContainer} from "testcontainers";
import { Umzug, SequelizeStorage } from "umzug";

import { sequelizeConfig } from "../configs/sequelize";

export const CONSTANTS = {
  POSTGRES_USER: "test-user",
  POSTGRES_PASSWORD: "test-password",
  POSTGRES_DB: "signals_service"
};

export const startTestContainer = async (): Promise<StartedTestContainer> => {
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
  
  const container: StartedTestContainer = await startTestContainer();
  const host = container.getHost();
  const port = container.getMappedPort(5432);

  process.env.POSTGRES_HOST = host;
  process.env.POSTGRES_PORT = port.toString();
  process.env.POSTGRES_USER = CONSTANTS.POSTGRES_USER;
  process.env.POSTGRES_PASSWORD = CONSTANTS.POSTGRES_PASSWORD;
  process.env.POSTGRES_DB = CONSTANTS.POSTGRES_DB;

  console.log("[globalSetup] Running migrations...");

  const sequelize = new Sequelize({
    ...sequelizeConfig,
    host,
    port: Number(port),
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
      containerId: container.getId(),
    })
  );

  console.log("[globalSetup] Container started and migrations complete.");
}
