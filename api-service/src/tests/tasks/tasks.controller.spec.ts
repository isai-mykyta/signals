import { TasksController } from "../../controllers";
import { mockTask } from "../fixtures";

const createTaskMock = jest.fn();
const getTaskByIdMock = jest.fn();
const searchTasksMock = jest.fn();
const deleteTaskByIdMock = jest.fn();
const logTaskSignalMock = jest.fn();
const runTaskByIdMock = jest.fn();
const completeTaskByIdMock = jest.fn();
const stopTaskByIdMock = jest.fn();

jest.mock("../../services", () => {
  return {
    TasksService: jest.fn().mockImplementation(() => {
      return {
        createTask: createTaskMock,
        getTaskById: getTaskByIdMock,
        searchTasks: searchTasksMock,
        deleteTaskById: deleteTaskByIdMock,
        logTaskSignal: logTaskSignalMock,
        runTaskById: runTaskByIdMock,
        completeTaskById: completeTaskByIdMock,
        stopTaskById: stopTaskByIdMock
      };
    }),
  };
});

describe("TasksController", () => {
  let controller: TasksController;

  beforeEach(() => {
    controller = new TasksController();
    jest.clearAllMocks();
  });
    
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create new task.", async () => {
    const task = mockTask(1, 1);
    createTaskMock.mockResolvedValue(task);
    await controller.createTask(task);
    expect(createTaskMock).toHaveBeenCalledTimes(1);
    expect(createTaskMock).toHaveBeenCalledWith(task);
  });

  test("Should get task by id.", async () => {
    const task = mockTask(1, 1);
    const params = { id: task.id };
    getTaskByIdMock.mockResolvedValue(task);
    await controller.getTaskById(params.id);
    expect(getTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should search tasks.", async () => {
    const task = mockTask(1, 1);
    searchTasksMock.mockResolvedValue([task]);
    await controller.searchTasks({});
    expect(searchTasksMock).toHaveBeenCalledTimes(1);
    expect(searchTasksMock).toHaveBeenCalledWith({}, "DESC");
  });

  test("Should delete task by id.", async () => {
    const params = { id: 1 };
    await controller.deleteTaskById(params.id);
    expect(deleteTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteTaskByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should log task signal.", async () => {
    const task = mockTask(1, 1);
    const params = { id: task.id };
    getTaskByIdMock.mockResolvedValue(task);
    await controller.logTaskSignal(params.id);
    expect(logTaskSignalMock).toHaveBeenCalledTimes(1);
    expect(logTaskSignalMock).toHaveBeenCalledWith(params.id);
    expect(getTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should run task by id.", async () => {
    const task = mockTask(1, 1);
    const params = { id: task.id };
    getTaskByIdMock.mockResolvedValue(task);
    await controller.runTaskById(params.id);
    expect(runTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(runTaskByIdMock).toHaveBeenCalledWith(params.id);
    expect(getTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should complete task by id.", async () => {
    const task = mockTask(1, 1);
    const params = { id: task.id };
    getTaskByIdMock.mockResolvedValue(task);
    await controller.completeTaskById(params.id);
    expect(completeTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(completeTaskByIdMock).toHaveBeenCalledWith(params.id);
    expect(getTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should stopTaskById task by id.", async () => {
    const task = mockTask(1, 1);
    const params = { id: task.id };
    getTaskByIdMock.mockResolvedValue(task);
    await controller.stopTaskById(params.id);
    expect(stopTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(stopTaskByIdMock).toHaveBeenCalledWith(params.id);
    expect(getTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(params.id);
  });
});
