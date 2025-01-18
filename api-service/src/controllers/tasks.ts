import { Body, Delete, Get, Middlewares, Path, Post, Queries, Response, Route, SuccessResponse } from "tsoa";

import { ApplicationError } from "../common";
import { TasksDto } from "../dtos";
import { parseQueryParams, validateQueryParams, validateRequestBody } from "../middlewares";
import { TasksService } from "../services";
import { CreateTaskOptions, HttpStatusCode, SearchTasksOptions } from "../types";
import { CreateTaskValidator, SearchTasksValidator } from "../validators";

const validateCreateTask = validateRequestBody(CreateTaskValidator);
const validateTaskQueryParams = validateQueryParams(SearchTasksValidator);

@Route("tasks")
export class TasksController {
  private tasksService = new TasksService();

  /**
  * Create a new task
  * @summary Returns created task
  */
  @Post()
  @Middlewares([validateCreateTask])
  @SuccessResponse("201")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid strategy id")
  public async createTask(@Body() body: CreateTaskOptions): Promise<TasksDto> {
    const task = await this.tasksService.createTask(body);
    return new TasksDto(task);
  }

  /**
  * Get a task by id
  * @summary Returns task by id
  */
  @Get("{id}")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Task is not found.")
  public async getTaskById(@Path() id: number): Promise<TasksDto> {
    const task = await this.tasksService.getTaskById(id);
    return new TasksDto(task);
  }

  /**
  * Get array of tasks
  * @summary Returns tasks array filtered by query params
  */
  @Get()
  @Middlewares([parseQueryParams, validateTaskQueryParams])
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  public async searchTasks(@Queries() queryParams: SearchTasksOptions): Promise<TasksDto[]> {
    const tasks = await this.tasksService.searchTasks(queryParams, queryParams?.order as "ASC" | "DESC" || "DESC");
    return tasks.map((task) => new TasksDto(task));
  }

  /**
  * Delete task by id
  * @summary Deletes task by it's id, returns empty response
  */
  @Delete("{id}")
  @SuccessResponse("204")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Task is not found.")
  public async deleteTaskById(@Path() id: number): Promise<void> {
    await this.tasksService.deleteTaskById(id);
  }

  /**
  * Log signal for task by id
  * @summary Returns updated task
  */
  @Post("{id}/log")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Task is not found.")
  public async logTaskSignal(@Path() id: number): Promise<TasksDto> {
    await this.tasksService.logTaskSignal(id);
    const task = await this.tasksService.getTaskById(id);
    return new TasksDto(task);
  }

  /**
  * Run task by id
  * @summary Returns started task
  */
  @Post("{id}/run")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Task is not found.")
  public async runTaskById(@Path() id: number): Promise<TasksDto> {
    await this.tasksService.runTaskById(id);
    const task = await this.tasksService.getTaskById(id);
    return new TasksDto(task);
  }

  /**
  * Complete task by id
  * @summary Returns completed task
  */
  @Post("{id}/complete")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Task is not found.")
  public async completeTaskById(@Path() id: number): Promise<TasksDto> {
    await this.tasksService.completeTaskById(id);
    const task = await this.tasksService.getTaskById(id);
    return new TasksDto(task);
  }

  /**
  * Stop task by id
  * @summary Returns stopped task
  */
  @Post("{id}/stop")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Task is not found.")
  public async stopTaskById(@Path() id: number): Promise<TasksDto> {
    await this.tasksService.stopTaskById(id);
    const task = await this.tasksService.getTaskById(id);
    return new TasksDto(task);
  }
}
