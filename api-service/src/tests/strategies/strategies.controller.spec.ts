import { Request, Response } from "express";

import { StrategiesController } from "../../controllers";
import { mockStrategy } from "../fixtures";

const createStrategyMock = jest.fn();
const getStrategyByIdMock = jest.fn();
const searchStrategiesMock = jest.fn();
const deleteStrategyByIdMock = jest.fn();
const activateStrategyByIdMock = jest.fn();
const disableStrategyByIdMock = jest.fn();

jest.mock("../../services", () => {
  return {
    StrategiesService: jest.fn().mockImplementation(() => {
      return {
        createStrategy: createStrategyMock,
        getStrategyById: getStrategyByIdMock,
        searchStrategies: searchStrategiesMock,
        deleteStrategyById: deleteStrategyByIdMock,
        activateStrategyById: activateStrategyByIdMock,
        disableStrategyById: disableStrategyByIdMock
      };
    }),
  };
});

describe("StrategiesController", () => {
  let controller: StrategiesController;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(() => {
    controller = new StrategiesController();
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test("Should create new strategy.", async () => {
    const strategy = mockStrategy(1, "Mock strategy");
    createStrategyMock.mockResolvedValue(strategy);
    await controller.createStrategy({ body: strategy } as Request, mockResponse as unknown as Response);
    expect(createStrategyMock).toHaveBeenCalledTimes(1);
    expect(createStrategyMock).toHaveBeenCalledWith(strategy);
  });

  test("Should get strategy by id.", async () => {
    const strategy = mockStrategy(1, "Mock strategy");
    const params = { id: strategy.id };
    getStrategyByIdMock.mockResolvedValue(strategy);
  
    await controller.getStrategyById(
      { params } as unknown as Request, 
      mockResponse as unknown as Response
    );
  
    expect(getStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(getStrategyByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should search strategies.", async () => {
    const strategy = mockStrategy(1, "Mock strategy");
    searchStrategiesMock.mockResolvedValue([strategy]);
    await controller.searchStrategies({} as Request, mockResponse as unknown as Response);
    expect(searchStrategiesMock).toHaveBeenCalledTimes(1);
    expect(searchStrategiesMock).toHaveBeenCalledWith(undefined, "DESC");
  });

  test("Should delete strategy by id.", async () => {
    const params = { id: 1 };
    await controller.deleteStrategyById({ params } as unknown as Request, mockResponse as unknown as Response);
    expect(deleteStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteStrategyByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should active strategy by id.", async () => {
    const params = { id: 1 };
    activateStrategyByIdMock.mockResolvedValue(mockStrategy(1, "Mock strategy"));
    await controller.activateStrategyById({ params } as unknown as Request, mockResponse as unknown as Response);
    expect(activateStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(activateStrategyByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should disable strategy by id.", async () => {
    const params = { id: 1 };
    disableStrategyByIdMock.mockResolvedValue(mockStrategy(1, "Mock strategy"));
    await controller.disableStrategyById({ params } as unknown as Request, mockResponse as unknown as Response);
    expect(disableStrategyByIdMock).toHaveBeenCalledTimes(1);
    expect(disableStrategyByIdMock).toHaveBeenCalledWith(params.id);
  });
});
