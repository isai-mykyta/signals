import { CreateTaskOptions, Task } from "../types";
import { ApiService } from "./api";

export class TasksService {
  private readonly apiService = new ApiService();

  public async createTask(data: CreateTaskOptions): Promise<Task> {
    return this.apiService.call<Task>({ method: "POST", path: "/tasks", data });
  }
}
