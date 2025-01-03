// eslint-disable-next-line import/order
import * as dotenv from "dotenv";

dotenv.config();

import { Sequelize } from "sequelize-typescript";

import { app } from "./app";
import { sequelizeConfig } from "./configs";

const HTTP_PORT = process.env.HTTP_PORT || 8080;

const sequelize = new Sequelize(sequelizeConfig);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`API service is running on port ${HTTP_PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
