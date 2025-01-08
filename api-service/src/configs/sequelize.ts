import { Dialect } from "sequelize";

import { StrategyModel, MarketModel, TaskModel, SignalModel } from "../models";

export const sequelizeConfig = {
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  dialect: "postgres" as Dialect,
  models: [MarketModel, StrategyModel, TaskModel, SignalModel],
};
