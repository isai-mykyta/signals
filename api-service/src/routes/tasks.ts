import { Request, Response, Router } from "express";

import { TasksController } from "../controllers";
import { parseQueryParams, validateQueryParams, validateRequestBody } from "../middlewares";
import { CreateTaskValidator, SearchTasksValidator } from "../validators";

const tasksRouter = Router();
const tasksController = new TasksController();

tasksRouter.post(
  "/",
  validateRequestBody(CreateTaskValidator),
  (req: Request, res: Response) => tasksController.createTask(req, res)
);

tasksRouter.get(
  "/",
  parseQueryParams,
  validateQueryParams(SearchTasksValidator),
  (req: Request, res: Response) => tasksController.searchTasks(req, res)
);

tasksRouter.get(
  "/:id",
  (req: Request, res: Response) => tasksController.getTaskById(req, res)
);

tasksRouter.delete(
  "/:id",
  (req: Request, res: Response) => tasksController.deleteTaskById(req, res)
);

tasksRouter.post(
  "/:id/log",
  (req: Request, res: Response) => tasksController.logTaskSignal(req, res)
);

tasksRouter.post(
  "/:id/run",
  (req: Request, res: Response) => tasksController.runTaskById(req, res)
);

tasksRouter.post(
  "/:id/complete",
  (req: Request, res: Response) => tasksController.completeTaskById(req, res)
);

tasksRouter.post(
  "/:id/stop",
  (req: Request, res: Response) => tasksController.stopTaskById(req, res)
);

export { tasksRouter };
