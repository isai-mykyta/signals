import { Request, Response } from "express";

import { StrategiesController } from "../../controllers";
import { mockStrategy } from "../fixtures";

const createStrategyMock = jest.fn();
const getStrategyByIdMock = jest.fn();
const searchStrategiesMock = jest.fn();
const deleteStrategyByIdMock = jest.fn();

jest.mock("../../services", () => {
  return {
    StrategiesService: jest.fn().mockImplementation(() => {
      return {
        createStrategy: createStrategyMock,
        getStrategyById: getStrategyByIdMock,
        searchStrategies: searchStrategiesMock,
        deleteStrategyById: deleteStrategyByIdMock,
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
});
