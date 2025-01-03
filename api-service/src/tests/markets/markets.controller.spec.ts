import { Request, Response } from "express";

import { MarketsController } from "../../controllers";
import { mockMarket } from "../fixtures";

const createMarketMock = jest.fn();
const getMarketByIdMock = jest.fn();
const searchMarketsMock = jest.fn();
const deleteMarketByIdMock = jest.fn();
const updateMarketByIdMock = jest.fn();

jest.mock("../../services", () => {
  return {
    MarketsService: jest.fn().mockImplementation(() => {
      return {
        createMarket: createMarketMock,
        getMarketById: getMarketByIdMock,
        searchMarkets: searchMarketsMock,
        deleteMarketById: deleteMarketByIdMock,
        updateMarketById: updateMarketByIdMock,
      };
    }),
  };
});

describe("MarketsController", () => {
  let controller: MarketsController;
  const market = mockMarket(1, "Market 1");

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  
  beforeEach(() => {
    controller = new MarketsController();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create new market.", async () => {
    const body = { name: "Market 1", url: "http://example.com" };
    createMarketMock.mockResolvedValue({ ...market, ...body});
    await controller.createMarket({ body } as Request, mockResponse as unknown as Response);
    expect(createMarketMock).toHaveBeenCalledTimes(1);
    expect(createMarketMock).toHaveBeenCalledWith(body);
  });

  test("Should get market by id.", async () => {
    const params = { id: 1 };
    getMarketByIdMock.mockResolvedValue({ ...market, ...params });

    await controller.getMarketById(
      { params } as unknown as Request, 
      mockResponse as unknown as Response
    );

    expect(getMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(getMarketByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should search markets.", async () => {
    searchMarketsMock.mockResolvedValue([market]);
    await controller.searchMarkets({} as Request, mockResponse as unknown as Response);
    expect(searchMarketsMock).toHaveBeenCalledTimes(1);
    expect(searchMarketsMock).toHaveBeenCalledWith(undefined, "DESC");
  });

  test("Should update market by id.", async () => {
    const body = { name: "Market 2", url: "http://example2.com" };
    const params = { id: 1 };
    getMarketByIdMock.mockResolvedValue({ ...market, ...body });
    await controller.updateMarketById({ params, body } as unknown as Request, mockResponse as unknown as Response);
    expect(updateMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(updateMarketByIdMock).toHaveBeenCalledWith(params.id, body);
    expect(getMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(getMarketByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should delete market by id.", async () => {
    const params = { id: 1 };
    await controller.deleteMarketById({ params } as unknown as Request, mockResponse as unknown as Response);
    expect(deleteMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteMarketByIdMock).toHaveBeenCalledWith(params.id);
  });
});
