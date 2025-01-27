import "express-async-errors";
import "reflect-metadata";

import express from "express";
import * as swaggerUi from "swagger-ui-express";

import { errorHandler } from "./middlewares";
import { RmqClient } from "./rmqClient";
import { RegisterRoutes } from "./routes/routes";
import * as swaggerSpec from "./spec/swagger.json";
import { HttpStatusCode } from "./types";

const app = express();

const rmqClient = new RmqClient({
  host: process.env.RABBITMQ_HOST,
  password: process.env.RABBITMQ_PASSWORD,
  user: process.env.RABBITMQ_USER,
  port: Number(process.env.RABBITMQ_PORT)
});

app.use(express.json());

app.use((err: SyntaxError & { status: number; type: string }, _: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err && err.type === "entity.parse.failed") {
    res.status(HttpStatusCode.BAD_REQUEST)
      .set("Content-Type", "application/json")
      .json({ message: "JSON malformed" });
  } else {
    next(err);
  }
});

app.use("/spec", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

RegisterRoutes(app);

app.use(errorHandler);

export { app, rmqClient };
