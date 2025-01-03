import { Request, Response, Router } from "express";

import { MarketsController } from "../controllers";
import { 
  parseQueryParams, 
  validateQueryParams, 
  validateRequestBody 
} from "../middlewares";
import { 
  CreateMarketRequestValidator, 
  SearchMarketsRequestValidator, 
  UpdateMarketRequestValidator 
} from "../validators";

const marketsRouter = Router();
const marketsController = new MarketsController();

marketsRouter.post(
  "/", 
  validateRequestBody(CreateMarketRequestValidator), 
  (req: Request, res: Response) => marketsController.createMarket(req, res)
);

marketsRouter.get(
  "/",
  parseQueryParams,
  validateQueryParams(SearchMarketsRequestValidator),
  (req: Request, res: Response) => marketsController.searchMarkets(req, res)
);

marketsRouter.get(
  "/:id", 
  (req: Request, res: Response) => marketsController.getMarketById(req, res)
);

marketsRouter.delete(
  "/:id", 
  (req: Request, res: Response) => marketsController.deleteMarketById(req, res)
);

marketsRouter.put(
  "/:id",
  validateRequestBody(UpdateMarketRequestValidator),
  (req: Request, res: Response) => marketsController.updateMarketById(req, res)
);

export { marketsRouter };
