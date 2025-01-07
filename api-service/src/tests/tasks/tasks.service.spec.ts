import { ApplicationError } from "../../common";
import { TasksService } from "../../services";
import { CustomErrorType, TaskStatus } from "../../types";
import { mockStrategy, mockTask } from "../fixtures";

const createTaskMock = jest.fn();
const getTaskByIdMock = jest.fn();
const searchTasksMock = jest.fn();
const deleteTaskByIdMock = jest.fn();
const updateTaskByIdMock = jest.fn();

const getStrategyByIdMock = jest.fn();

jest.mock("../../repositories", () => {
  return {
    TasksRepository: jest.fn().mockImplementation(() => {
      return {
        createTask: createTaskMock,
        getTaskById: getTaskByIdMock,
        searchTasks: searchTasksMock,
        deleteTaskById: deleteTaskByIdMock,
        updateTaskById: updateTaskByIdMock,
      };
    }),
    StrategiesRepository: jest.fn().mockImplementation(() => {
      return {
        getStrategyById: getStrategyByIdMock
      };
    })
  };
});

describe("TasksService", () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    test("Should create running task.", async () => {
      const strategy = mockStrategy(1, "test-strategy");
      const task = mockTask(1, strategy.id);
      strategy.taskSchedule.startAt = Date.now();

      getStrategyByIdMock.mockResolvedValue(strategy);
      createTaskMock.mockResolvedValue(task);
      await service.createTask(task);

      expect(getStrategyByIdMock).toHaveBeenCalledTimes(1);
      expect(getStrategyByIdMock).toHaveBeenCalledWith(task.strategyId);
      expect(createTaskMock).toHaveBeenCalledTimes(1);
      expect(createTaskMock).toHaveBeenCalledWith(expect.objectContaining({
        status: TaskStatus.RUNNING,
        isActive: true
      }));
    });

    test("Should create completed task.", async () => {
      const strategy = mockStrategy(2, "test-strategy");
      const task = mockTask(2, strategy.id);
      strategy.taskSchedule.endAt = Date.now();

      getStrategyByIdMock.mockResolvedValue(strategy);
      createTaskMock.mockResolvedValue(task);
      await service.createTask(task);

      expect(getStrategyByIdMock).toHaveBeenCalledTimes(1);
      expect(getStrategyByIdMock).toHaveBeenCalledWith(task.strategyId);
      expect(createTaskMock).toHaveBeenCalledTimes(1);
      expect(createTaskMock).toHaveBeenCalledWith(expect.objectContaining({
        status: TaskStatus.COMPLETED,
        isActive: false
      }));
    });

    test("Should create pending task.", async () => {
      const strategy = mockStrategy(2, "test-strategy");
      const task = mockTask(2, strategy.id);
      strategy.taskSchedule.startAt = new Date().setFullYear(2050);

      getStrategyByIdMock.mockResolvedValue(strategy);
      createTaskMock.mockResolvedValue(task);
      await service.createTask(task);

      expect(getStrategyByIdMock).toHaveBeenCalledTimes(1);
      expect(getStrategyByIdMock).toHaveBeenCalledWith(task.strategyId);
      expect(createTaskMock).toHaveBeenCalledTimes(1);
      expect(createTaskMock).toHaveBeenCalledWith(expect.objectContaining({
        status: TaskStatus.PENDING,
        isActive: false
      }));
    });

    test("Should create default task.", async () => {
      const strategy = mockStrategy(2, "test-strategy");
      const task = mockTask(2, strategy.id);
      delete strategy.taskSchedule;

      getStrategyByIdMock.mockResolvedValue(strategy);
      createTaskMock.mockResolvedValue(task);
      await service.createTask(task);

      expect(getStrategyByIdMock).toHaveBeenCalledTimes(1);
      expect(getStrategyByIdMock).toHaveBeenCalledWith(task.strategyId);
      expect(createTaskMock).toHaveBeenCalledTimes(1);
      expect(createTaskMock).toHaveBeenCalledWith(expect.objectContaining({
        status: TaskStatus.RUNNING,
        isActive: true
      }));
    });
  });

  test("Should return task by id.", async () => {
    getTaskByIdMock.mockResolvedValue(mockTask(1, 1));
    await service.getTaskById(1);
    expect(getTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(1);
  });
  
  test("Should trow an error if strategy by id is not found.", async () => {
    getTaskByIdMock.mockResolvedValue(undefined);
    await expect(service.getTaskById(999)).rejects.toThrow(ApplicationError);
    await expect(service.getTaskById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should delete task by id.", async () => {
    getTaskByIdMock.mockResolvedValue(mockTask(1, 1));
    await service.deleteTaskById(1);
    expect(deleteTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteTaskByIdMock).toHaveBeenCalledWith(1);
  });
  
  test("Should throw an error if trying to delete task that doesn't exist.", async () => {
    getTaskByIdMock.mockResolvedValue(undefined);
    await expect(service.deleteTaskById(999)).rejects.toThrow(ApplicationError);
    await expect(service.deleteTaskById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should search tasks.", async () => {
    await service.searchTasks({});
    expect(searchTasksMock).toHaveBeenCalledTimes(1);
    expect(searchTasksMock).toHaveBeenCalledWith({}, "DESC");
  });

  test("Should update task by id.", async () => {
    getTaskByIdMock.mockResolvedValue(mockTask(1, 1));
    await service.updateTaskById(1, { strategyId: 2 });
    expect(updateTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(updateTaskByIdMock).toHaveBeenCalledWith(1, { strategyId: 2 });
  });

  test("Should throw an error if trying to update task that doesn't exist.", async () => {
    getTaskByIdMock.mockResolvedValue(undefined);
    await expect(service.updateTaskById(999, { strategyId: 2 })).rejects.toThrow(ApplicationError);
    await expect(service.updateTaskById(999, { strategyId: 2 })).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should log signal.", async () => {
    getTaskByIdMock.mockResolvedValue(mockTask(1, 1));
    updateTaskByIdMock.mockResolvedValue(undefined);
    await service.logTaskSignal(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(1);
    expect(updateTaskByIdMock).toHaveBeenCalledWith(1, expect.objectContaining({
      lastSignalAt: expect.anything()
    }));
  });

  test("Should throw an error if trying to log a signal for task that doesn't exist.", async () => {
    getTaskByIdMock.mockResolvedValue(undefined);
    await expect(service.logTaskSignal(999)).rejects.toThrow(ApplicationError);
    await expect(service.logTaskSignal(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should run task by id.", async () => {
    getTaskByIdMock.mockResolvedValue(mockTask(1, 1));
    updateTaskByIdMock.mockResolvedValue(undefined);
    await service.runTaskById(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(1);
    expect(updateTaskByIdMock).toHaveBeenCalledWith(1, expect.objectContaining({
      status: TaskStatus.RUNNING,
      isActive: true,
    }));
  });

  test("Should throw an error if trying to run a task that doesn't exist.", async () => {
    getTaskByIdMock.mockResolvedValue(undefined);
    await expect(service.runTaskById(999)).rejects.toThrow(ApplicationError);
    await expect(service.runTaskById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should complete task by id.", async () => {
    getTaskByIdMock.mockResolvedValue(mockTask(1, 1));
    updateTaskByIdMock.mockResolvedValue(undefined);
    await service.completeTaskById(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(1);
    expect(updateTaskByIdMock).toHaveBeenCalledWith(1, expect.objectContaining({
      status: TaskStatus.COMPLETED,
      isActive: false,
    }));
  });

  test("Should throw an error if trying to complete a task that doesn't exist.", async () => {
    getTaskByIdMock.mockResolvedValue(undefined);
    await expect(service.completeTaskById(999)).rejects.toThrow(ApplicationError);
    await expect(service.completeTaskById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should stop task by id.", async () => {
    getTaskByIdMock.mockResolvedValue(mockTask(1, 1));
    updateTaskByIdMock.mockResolvedValue(undefined);
    await service.stopTaskById(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(1);
    expect(updateTaskByIdMock).toHaveBeenCalledWith(1, expect.objectContaining({
      status: TaskStatus.STOPPED,
      isActive: false,
    }));
  });

  test("Should throw an error if trying to stop a task that doesn't exist.", async () => {
    getTaskByIdMock.mockResolvedValue(undefined);
    await expect(service.stopTaskById(999)).rejects.toThrow(ApplicationError);
    await expect(service.stopTaskById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });
});
