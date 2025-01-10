// eslint-disable-next-line import/order
import * as dotenv from "dotenv";

dotenv.config();

import { app } from "./app";

const HTTP_PORT = process.env.HTTP_PORT || 8081;

app.listen(HTTP_PORT, () => {
  console.log(`Tasks-engine service is running on port ${HTTP_PORT}...`);
});
