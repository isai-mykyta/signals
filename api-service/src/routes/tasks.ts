import { Request, Response, Router } from "express";

import { TasksController } from "../controllers";
import { parseQueryParams, validateQueryParams, validateRequestBody } from "../middlewares";
import { CreateTaskValidator, SearchTasksValidator, UpdateTaskValidator } from "../validators";

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

tasksRouter.put(
  "/:id",
  validateRequestBody(UpdateTaskValidator),
  (req: Request, res: Response) => tasksController.updateTaskById(req, res)
);

export { tasksRouter };
