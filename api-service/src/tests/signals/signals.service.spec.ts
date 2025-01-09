import { ApplicationError } from "../../common";
import { SignalsService } from "../../services";
import { CustomErrorType } from "../../types";
import { mockMarket, mockSignal, mockStrategy, mockTask } from "../fixtures";

const createSignalMock = jest.fn();
const getSignalByIdMock = jest.fn();
const searchSignalsMock = jest.fn();
const deleteSignalByIdMock = jest.fn();

const getStrategyByIdMock = jest.fn();

const getTaskByIdMock = jest.fn();

const getMarketByIdMock = jest.fn();

jest.mock("../../repositories", () => {
  return {
    SignalsRepository: jest.fn().mockImplementation(() => {
      return {
        createSignal: createSignalMock,
        getSignalById: getSignalByIdMock,
        searchSignals: searchSignalsMock,
        deleteSignalById: deleteSignalByIdMock,
      };
    }),
    StrategiesRepository: jest.fn().mockImplementation(() => {
      return {
        getStrategyById: getStrategyByIdMock
      };
    }),
    TasksRepository: jest.fn().mockImplementation(() => {
      return {
        getTaskById: getTaskByIdMock
      };
    }),
    MarketsRepository: jest.fn().mockImplementation(() => {
      return {
        getMarketById: getMarketByIdMock
      };
    })
  };
});

describe("SignalsService", () => {
  let service: SignalsService;
  
  beforeEach(() => {
    service = new SignalsService();
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create and return a new signal.", async () => {
    const market = mockMarket(1, "test market");
    const strategy = mockStrategy(1, "test strategy");
    strategy.marketId = market.id;

    const task = mockTask(1, strategy.id);
    task.strategyId = strategy.id;

    const signal = mockSignal(1);
    signal.marketId = market.id;
    signal.strategyId = strategy.id;
    signal.taskId = task.id;

    getStrategyByIdMock.mockResolvedValue(strategy);
    getTaskByIdMock.mockResolvedValue(task);
    getMarketByIdMock.mockResolvedValue(market);
    createSignalMock.mockResolvedValue(signal);

    await service.createSignal(signal);

    expect(getStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(getStrategyByIdMock).toHaveBeenCalledWith(signal.strategyId);
    expect(getTaskByIdMock).toHaveBeenCalledTimes(1);
    expect(getTaskByIdMock).toHaveBeenCalledWith(signal.taskId);
    expect(getMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(getMarketByIdMock).toHaveBeenCalledWith(signal.marketId);
    expect(createSignalMock).toHaveBeenCalledTimes(1);
    expect(createSignalMock).toHaveBeenCalledWith(signal);
  });

  test("Should throw error if trying to create signal with invalid strategyId.", async () => {
    const signal = mockSignal(1);
    getStrategyByIdMock.mockResolvedValue(undefined);

    await expect(service.createSignal(signal)).rejects.toThrow(ApplicationError);
    await expect(service.createSignal(signal)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.VALIDATION_ERROR,
    }));
  });

  test("Should throw error if trying to create signal with invalid taskId.", async () => {
    const strategy = mockStrategy(1, "test strategy");
    const signal = mockSignal(1);

    getStrategyByIdMock.mockResolvedValue(strategy);
    getTaskByIdMock.mockResolvedValue(undefined);

    await expect(service.createSignal(signal)).rejects.toThrow(ApplicationError);
    await expect(service.createSignal(signal)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.VALIDATION_ERROR,
    }));
  });

  test("Should throw error if trying to create signal with invalid marketId.", async () => {
    const strategy = mockStrategy(1, "test strategy");
    const task = mockTask(1, strategy.id);
    const signal = mockSignal(1);

    getStrategyByIdMock.mockResolvedValue(strategy);
    getTaskByIdMock.mockResolvedValue(task);
    getMarketByIdMock.mockResolvedValue(undefined);

    await expect(service.createSignal(signal)).rejects.toThrow(ApplicationError);
    await expect(service.createSignal(signal)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.VALIDATION_ERROR,
    }));
  });

  test("Should return signal by id.", async () => {
    getSignalByIdMock.mockResolvedValue(mockSignal(1));
    await service.getSignalById(1);
    expect(getSignalByIdMock).toHaveBeenCalledTimes(1);
    expect(getSignalByIdMock).toHaveBeenCalledWith(1);
  });
  
  test("Should trow an error if signal by id is not found.", async () => {
    getSignalByIdMock.mockResolvedValue(undefined);
    await expect(service.getSignalById(999)).rejects.toThrow(ApplicationError);
    await expect(service.getSignalById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should search signals.", async () => {
    await service.searchSignals({});
    expect(searchSignalsMock).toHaveBeenCalledTimes(1);
    expect(searchSignalsMock).toHaveBeenCalledWith({}, "DESC");
  });

  test("Should delete signal by id.", async () => {
    getSignalByIdMock.mockResolvedValue(mockSignal(1));
    await service.deleteSignalById(1);
    expect(deleteSignalByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteSignalByIdMock).toHaveBeenCalledWith(1);
  });
  
  test("Should throw an error if trying to delete signal that doesn't exist.", async () => {
    getSignalByIdMock.mockResolvedValue(undefined);
    await expect(service.deleteSignalById(999)).rejects.toThrow(ApplicationError);
    await expect(service.deleteSignalById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });
});
