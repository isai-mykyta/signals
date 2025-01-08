import { Request, Response, Router } from "express";

import { SignalsController } from "../controllers";
import { parseQueryParams, validateQueryParams, validateRequestBody } from "../middlewares";
import { CreateSignalRequestValidator, SearchSignalsRequestValidator } from "../validators";

const signalsRouter = Router();
const signalsController = new SignalsController();

signalsRouter.post(
  "/", 
  validateRequestBody(CreateSignalRequestValidator), 
  (req: Request, res: Response) => signalsController.createSignal(req, res)
);

signalsRouter.get(
  "/",
  parseQueryParams,
  validateQueryParams(SearchSignalsRequestValidator),
  (req: Request, res: Response) => signalsController.searchSignals(req, res)
);

signalsRouter.get(
  "/:id",
  (req: Request, res: Response) => signalsController.getSignalById(req, res)
);

signalsRouter.delete(
  "/:id", 
  (req: Request, res: Response) => signalsController.deleteSignalById(req, res)
);

export { signalsRouter };
