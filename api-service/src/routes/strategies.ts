import { Router, Request, Response } from "express";

import { StrategiesController } from "../controllers";
import { 
  parseQueryParams, 
  validateQueryParams, 
  validateStrategyPaylod 
} from "../middlewares";
import { SearchStrategiesRequestValidator } from "../validators";

const strategiesRouter = Router();
const strategiesController = new StrategiesController();

strategiesRouter.post(
  "/", 
  validateStrategyPaylod(), 
  (req: Request, res: Response) => strategiesController.createStrategy(req, res)
);

strategiesRouter.post(
  "/:id/activate",
  (req: Request, res: Response) => strategiesController.activateStrategyById(req, res)
);

strategiesRouter.post(
  "/:id/disable",
  (req: Request, res: Response) => strategiesController.disableStrategyById(req, res)
);

strategiesRouter.get(
  "/",
  parseQueryParams,
  validateQueryParams(SearchStrategiesRequestValidator),
  (req: Request, res: Response) => strategiesController.searchStrategies(req, res)
);

strategiesRouter.get(
  "/:id",
  (req: Request, res: Response) => strategiesController.getStrategyById(req, res)
);

strategiesRouter.delete(
  "/:id", 
  (req: Request, res: Response) => strategiesController.deleteStrategyById(req, res)
);

export { strategiesRouter };
