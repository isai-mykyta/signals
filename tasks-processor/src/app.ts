import "express-async-errors";
import "reflect-metadata";

import express from "express";

const app = express();

app.use(express.json());

app.use((err: SyntaxError & { status: number; type: string }, _: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err && err.type === "entity.parse.failed") {
    res.status(400)
      .set("Content-Type", "application/json")
      .json({ message: "JSON malformed" });
  } else {
    next(err);
  }
});

export { app };
