import { Request, Response } from "express";

import { TasksDto } from "../dtos";
import { TasksService } from "../services";

export class TasksController {
  private tasksService = new TasksService();

  public async createTask(req: Request, res: Response): Promise<void> {
    const task = await this.tasksService.createTask(req.body);
    res.status(201).send(new TasksDto(task));
  }

  public async getTaskById(req: Request, res: Response): Promise<void> {
    const task = await this.tasksService.getTaskById(Number(req.params.id));
    res.status(200).send(new TasksDto(task));
  }
  
  public async searchTasks(req: Request, res: Response): Promise<void> {
    const tasks = await this.tasksService.searchTasks(req.query, req.query.order as "ASC" | "DESC");
    res.status(200).send(tasks.map((task) => new TasksDto(task)));
  }
  
  public async deleteTaskById(req: Request, res: Response): Promise<void> {
    await this.tasksService.deleteTaskById(Number(req.params.id));
    res.status(204).send();
  }
  
  public async updateTaskById(req: Request, res: Response): Promise<void> {
    await this.tasksService.updateTaskById(Number(req.params.id), req.body);
    const task = await this.tasksService.getTaskById(Number(req.params.id));
    res.status(200).send(new TasksDto(task));
  }
}
