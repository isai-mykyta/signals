import { ApplicationError } from "../../common";
import { MarketsService } from "../../services";
import { CustomErrorType } from "../../types";
import { mockMarket } from "../fixtures";

const createMarketMock = jest.fn();
const getMarketByIdMock = jest.fn();
const searchMarketsMock = jest.fn();
const deleteMarketByIdMock = jest.fn();
const updateMarketByIdMock = jest.fn();

jest.mock("../../repositories", () => {
  return {
    MarketsRepository: jest.fn().mockImplementation(() => {
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

describe("MarketsService", () => {
  let service: MarketsService;

  beforeEach(() => {
    service = new MarketsService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create and return a new market.", async () => {
    await service.createMarket({ name: "Market 1", url: "http://example.com" });
    expect(createMarketMock).toHaveBeenCalledTimes(1);
    expect(createMarketMock).toHaveBeenCalledWith({ name: "Market 1", url: "http://example.com" });
  });

  test("Should return market by id.", async () => {
    getMarketByIdMock.mockResolvedValue(mockMarket(1, "Mock market"));
    await service.getMarketById(1);
    expect(getMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(getMarketByIdMock).toHaveBeenCalledWith(1);
  });

  test("Should trow an error if market by id is not found.", async () => {
    getMarketByIdMock.mockResolvedValue(undefined);
    await expect(service.getMarketById(999)).rejects.toThrow(ApplicationError);
    await expect(service.getMarketById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should search markets.", async () => {
    await service.searchMarkets({});
    expect(searchMarketsMock).toHaveBeenCalledTimes(1);
    expect(searchMarketsMock).toHaveBeenCalledWith({}, "DESC");
  });

  test("Should update market by id.", async () => {
    getMarketByIdMock.mockResolvedValue(mockMarket(1, "Mock market"));
    await service.updateMarketById(1, { name: "name" });
    expect(getMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(getMarketByIdMock).toHaveBeenCalledWith(1);
    expect(updateMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(updateMarketByIdMock).toHaveBeenCalledWith(1, { name: "name" });
  });

  test("Should throw an error if trying to update market that doesn't exist.", async () => {
    getMarketByIdMock.mockResolvedValue(undefined);
    await expect(service.updateMarketById(999, { name: "new-name" })).rejects.toThrow(ApplicationError);
    await expect(service.updateMarketById(999, { name: "new-name" })).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });

  test("Should delete market by id.", async () => {
    getMarketByIdMock.mockResolvedValue(mockMarket(1, "Mock market"));;
    await service.deleteMarketById(1);
    expect(getMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(getMarketByIdMock).toHaveBeenCalledWith(1);
    expect(deleteMarketByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteMarketByIdMock).toHaveBeenCalledWith(1);
  });

  test("Should throw an error if trying to delete market that doesn't exist.", async () => {
    getMarketByIdMock.mockResolvedValue(undefined);
    await expect(service.deleteMarketById(999)).rejects.toThrow(ApplicationError);
    await expect(service.deleteMarketById(999)).rejects.toMatchObject(expect.objectContaining({
      type: CustomErrorType.NOT_FOUND,
    }));
  });
});
