import "express-async-errors";
import "reflect-metadata";

import express from "express";

import { errorHandler } from "./middlewares";
import { 
  marketsRouter, 
  strategiesRouter, 
  tasksRouter 
} from "./routes";
import { HttpStatusCode } from "./types";

const app = express();

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

app.use("/markets", marketsRouter);
app.use("/strategies", strategiesRouter);
app.use("/tasks", tasksRouter);
app.use(errorHandler);

export { app };
