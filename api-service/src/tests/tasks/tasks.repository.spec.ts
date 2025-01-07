import { Op } from "sequelize";

import { TaskModel } from "../../models";
import { TasksRepository } from "../../repositories";
import { Task, TaskStatus } from "../../types";
import { mockTask } from "../fixtures";

jest.mock("../../models", () => ({
  TaskModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn()
  }
}));

const mockTasks = (count: number): Task[] => {
  return new Array(count).map((_, idx) => (mockTask(idx, 1)));
};

describe("TasksRepository", () => {
  let repository: TasksRepository;

  beforeEach(() => {
    repository = new TasksRepository();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create a new task.", async () => {
    const [task] = mockTasks(1);
    (TaskModel.create as jest.Mock).mockResolvedValue({ dataValues: task });
    await repository.createTask(task);
    expect(TaskModel.create).toHaveBeenCalledTimes(1);
    expect(TaskModel.create).toHaveBeenCalledWith(task);
  });

  test("Should return task by id.", async () => {
    (TaskModel.findOne as jest.Mock).mockResolvedValue({ dataValues: mockTasks(1) });
    await repository.getTaskById(1);
    expect(TaskModel.findOne).toHaveBeenCalledTimes(1);
    expect(TaskModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("Should return an undefined if task by id is not found.", async () => {
    (TaskModel.findOne as jest.Mock).mockResolvedValue(null);
    const strategy = await repository.getTaskById(1);
    expect(strategy).toBe(undefined);
  });

  test("Should delete task by id.", async () => {
    (TaskModel.destroy as jest.Mock).mockResolvedValue(null);
    await repository.deleteTaskById(1);
    expect(TaskModel.destroy).toHaveBeenCalledTimes(1);
    expect(TaskModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("Should update task by id.", async () => {
    (TaskModel.update as jest.Mock).mockResolvedValue(null);
    await repository.updateTaskById(1, { strategyId: 1 });
    expect(TaskModel.update).toHaveBeenCalledTimes(1);
    expect(TaskModel.update).toHaveBeenCalledWith({ strategyId: 1 }, { where: { id: 1 } });
  });

  describe("searchTasks", () => {
    test("Should search tasks without any params.", async () => {
      const tasks = mockTasks(5);
      (TaskModel.findAll as jest.Mock).mockResolvedValue(tasks.map((task) => ({ dataValues: task })));
      await repository.searchTasks({});
        
      expect(TaskModel.findAll).toHaveBeenCalledTimes(1);
      expect(TaskModel.findAll).toHaveBeenCalledWith({
        where: {},
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });
  
    test("Should properly build search params.", async () => {
      const tasks = mockTasks(5);
      const ids = [1, 2];
      const strategyIds = [1];
      const startedAtFrom = new Date().toISOString();
      const endedAtFrom = new Date().toISOString();
      const statuses = [TaskStatus.RUNNING];
      const isActive = true;
      const from = new Date().toISOString();
      const to = new Date().toISOString();
  
      (TaskModel.findAll as jest.Mock).mockResolvedValue(tasks.map((task) => ({ dataValues: task })));
  
      const where = {
        id: { [Op.in]: ids },
        strategyId: { [Op.in]: strategyIds },
        createdAt: { [Op.gte]: from, [Op.lte]: to },
        startedAt: { [Op.gte]: startedAtFrom },
        endedAt: { [Op.gte]: endedAtFrom },
        status: { [Op.in]: statuses },
        isActive,
      };
  
      await repository.searchTasks({ 
        ids, 
        strategyIds, 
        startedAtFrom,
        endedAtFrom,
        statuses,
        isActive,
        from,
        to
      });
  
      expect(TaskModel.findAll).toHaveBeenCalledTimes(1);
      expect(TaskModel.findAll).toHaveBeenCalledWith({
        where,
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });
  });
});
