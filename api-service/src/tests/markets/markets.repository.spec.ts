import { Op } from "sequelize";

import { MarketModel } from "../../models";
import { MarketsRepository } from "../../repositories";
import { Market } from "../../types";
import { mockMarket } from "../fixtures";

jest.mock("../../models", () => ({
  MarketModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn()
  }
}));

const mockMarkets = (count: number): Market[] => {
  return new Array(count).map((_, idx) => (mockMarket(idx, `Market ${idx}`)));
};

describe("MarketsRepository", () => {
  let repository: MarketsRepository;

  beforeEach(() => {
    repository = new MarketsRepository();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create a new market.", async () => {
    (MarketModel.create as jest.Mock).mockResolvedValue({ dataValues: mockMarkets(1) });
    await repository.createMarket({
      name: "Market 1",
      url: "http://example.com"
    });

    expect(MarketModel.create).toHaveBeenCalledTimes(1);
    expect(MarketModel.create).toHaveBeenCalledWith({ name: "Market 1", url: "http://example.com" });
  });

  test("Should return market by id.", async () => {
    (MarketModel.findOne as jest.Mock).mockResolvedValue({ dataValues: mockMarkets(1) });
    await repository.getMarketById(1);

    expect(MarketModel.findOne).toHaveBeenCalledTimes(1);
    expect(MarketModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("Should return undefined if market by id is not found.", async () => {
    (MarketModel.findOne as jest.Mock).mockResolvedValue(null);
    const market = await repository.getMarketById(1);
    expect(MarketModel.findOne).toHaveBeenCalledTimes(1);
    expect(MarketModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(market).toBe(undefined);
  });

  test("Should delete market by id.", async () => {
    (MarketModel.destroy as jest.Mock).mockResolvedValue(null);
    await repository.deleteMarketById(1);
    expect(MarketModel.destroy).toHaveBeenCalledTimes(1);
    expect(MarketModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("Should update market by id.", async () => {
    (MarketModel.update as jest.Mock).mockResolvedValue(null);
    await repository.updateMarketById(1, { name: "new name" });
    expect(MarketModel.update).toHaveBeenCalledTimes(1);
    expect(MarketModel.update).toHaveBeenCalledWith({ name: "new name" }, { where: { id: 1 } });
  });

  describe("searchMarkets", () => {
    test("Should search markets without any params.", async () => {
      const markets = mockMarkets(5);
      (MarketModel.findAll as jest.Mock).mockResolvedValue(markets.map((market) => ({ dataValues: market })));
      await repository.searchMarkets({});

      expect(MarketModel.findAll).toHaveBeenCalledTimes(1);
      expect(MarketModel.findAll).toHaveBeenCalledWith({
        where: {},
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });

    test("Should properly build search params.", async () => {
      const markets = mockMarkets(5);
      const ids = [1, 2];
      const url = "http://example.com";
      const names = ["Market 1", "Market 2"];
      const from = new Date().toISOString();
      const to = new Date().toISOString();
  
      (MarketModel.findAll as jest.Mock).mockResolvedValue(markets.map((market) => ({ dataValues: market })));

      const where = {
        id: { [Op.in]: ids },
        name: { [Op.in]: names },
        createdAt: { [Op.gte]: from, [Op.lte]: to },
        url,
      };
  
      await repository.searchMarkets({ 
        ids, url, names, from, to
      });

      expect(MarketModel.findAll).toHaveBeenCalledTimes(1);
      expect(MarketModel.findAll).toHaveBeenCalledWith({
        where,
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });
  });
});
