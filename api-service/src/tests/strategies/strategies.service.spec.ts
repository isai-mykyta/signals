import { ApplicationError } from "../../common";
import { StrategiesService } from "../../services";
import { CustomErrorType } from "../../types";
import { mockMarket, mockStrategy } from "../fixtures";

const createStrategyMock = jest.fn();
const getStrategyByIdMock = jest.fn();
const searchStrategiesMock = jest.fn();
const deleteStrategyByIdMock = jest.fn();
const updateStrategyByIdMock = jest.fn();

const getMarketByIdMock = jest.fn();

jest.mock("../../repositories", () => {
  return {
    StrategiesRepository: jest.fn().mockImplementation(() => {
      return {
        createStrategy: createStrategyMock,
        getStrategyById: getStrategyByIdMock,
        searchStrategies: searchStrategiesMock,
        deleteStrategyById: deleteStrategyByIdMock,
        updateStrategyById: updateStrategyByIdMock,
      };
    }),
    MarketsRepository: jest.fn().mockImplementation(() => {
      return {
        getMarketById: getMarketByIdMock
      };
    })
  };
});

jest.mock("../../producers", () => {
  return {
    strategiesProducer: {
      sendCreationMessage: jest.fn()
    }
  };
});

describe("StrategiesService", () => {
  let service: StrategiesService;

  beforeEach(() => {
    service = new StrategiesService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create and return a new strategy.", async () => {
    const strategy = mockStrategy(1, "Mock strategy");
    const market = mockMarket(1, "Mock market");
    getMarketByIdMock.mockResolvedValue(market);
    await service.createStrategy(strategy);
    expect(getMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(getMarketByIdMock).toHaveBeenCalledWith(strategy.marketId);
    expect(createStrategyMock).toHaveBeenCalledTimes(1);
    expect(createStrategyMock).toHaveBeenCalledWith(strategy);
  });

  test("Should return strategy by id.", async () => {
    getStrategyByIdMock.mockResolvedValue(mockStrategy(1, "Mock strategy"));
    await service.getStrategyById(1);
    expect(getStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(getStrategyByIdMock).toHaveBeenCalledWith(1);
  });

  test("Should trow an error if strategy by id is not found.", async () => {
    getStrategyByIdMock.mockResolvedValue(undefined);
    await expect(service.getStrategyById(999)).rejects.toThrow(ApplicationError);
    await expect(service.getStrategyById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should search strategies.", async () => {
    await service.searchStrategies({});
    expect(searchStrategiesMock).toHaveBeenCalledTimes(1);
    expect(searchStrategiesMock).toHaveBeenCalledWith({}, "DESC");
  });

  test("Should update strategy by id.", async () => {
    getStrategyByIdMock.mockResolvedValue(mockStrategy(1, "Mock strategy"));
    await service.updateStrategyById(1, { name: "new-name" });
    expect(updateStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(updateStrategyByIdMock).toHaveBeenCalledWith(1, { name: "new-name" });
  });

  test("Should throw an error if trying to update strategy that doesn't exist.", async () => {
    getStrategyByIdMock.mockResolvedValue(undefined);
    await expect(service.updateStrategyById(999, { name: "new-name" })).rejects.toThrow(ApplicationError);
    await expect(service.updateStrategyById(999, { name: "new-name" })).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should delete strategy by id.", async () => {
    getStrategyByIdMock.mockResolvedValue(mockStrategy(1, "Mock strategy"));
    await service.deleteStrategyById(1);
    expect(deleteStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteStrategyByIdMock).toHaveBeenCalledWith(1);
  });

  test("Should throw an error if trying to delete strategy that doesn't exist.", async () => {
    getStrategyByIdMock.mockResolvedValue(undefined);
    await expect(service.deleteStrategyById(999)).rejects.toThrow(ApplicationError);
    await expect(service.deleteStrategyById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should activate strategy by id.", async () => {
    getStrategyByIdMock.mockResolvedValue(mockStrategy(1, "Mock strategy"));
    updateStrategyByIdMock.mockResolvedValue(undefined);
    await service.activateStrategyById(1);
    expect(getStrategyByIdMock).toHaveBeenCalledWith(1);
    expect(updateStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(updateStrategyByIdMock).toHaveBeenCalledWith(1, { isActive: true });
  });

  test("Should disable strategy by id.", async () => {
    getStrategyByIdMock.mockResolvedValue(mockStrategy(1, "Mock strategy"));
    updateStrategyByIdMock.mockResolvedValue(undefined);
    await service.disableStrategyById(1);
    expect(getStrategyByIdMock).toHaveBeenCalledWith(1);
    expect(updateStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(updateStrategyByIdMock).toHaveBeenCalledWith(1, { isActive: false });
  });

  test("Should throw an error if trying to activate strategy that doesn't exist.", async () => {
    getStrategyByIdMock.mockResolvedValue(undefined);
    await expect(service.activateStrategyById(999)).rejects.toThrow(ApplicationError);
    await expect(service.activateStrategyById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });
  
  test("Should throw an error if trying to disable strategy that doesn't exist.", async () => {
    getStrategyByIdMock.mockResolvedValue(undefined);
    await expect(service.disableStrategyById(999)).rejects.toThrow(ApplicationError);
    await expect(service.disableStrategyById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });
});
