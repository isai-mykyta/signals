import { Op } from "sequelize";

import { ApplicationError } from "../../common";
import { StrategyModel } from "../../models";
import { StrategiesRepository } from "../../repositories";
import { CustomErrorType, Strategy } from "../../types";
import { mockStrategy } from "../fixtures";

jest.mock("../../models", () => ({
  StrategyModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn()
  }
}));

const mockStrategies = (count: number): Strategy[] => {
  return new Array(count).map((_, idx) => (mockStrategy(idx, `Mock strategy ${idx}`)));
};

describe("StrategiesRepository", () => {
  let repository: StrategiesRepository;

  beforeEach(() => {
    repository = new StrategiesRepository();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create a new strategy.", async () => {
    const [strategy] = mockStrategies(1);
    (StrategyModel.create as jest.Mock).mockResolvedValue({ dataValues: strategy });
    await repository.createStrategy(strategy);
    expect(StrategyModel.create).toHaveBeenCalledTimes(1);
    expect(StrategyModel.create).toHaveBeenCalledWith(strategy);
  });

  test("Should return strategy by id.", async () => {
    (StrategyModel.findOne as jest.Mock).mockResolvedValue({ dataValues: mockStrategies(1) });
    await repository.getStrategyById(1);
    expect(StrategyModel.findOne).toHaveBeenCalledTimes(1);
    expect(StrategyModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("Should return an undefined if strategy by id is not found.", async () => {
    (StrategyModel.findOne as jest.Mock).mockResolvedValue(null);
    const strategy = await repository.getStrategyById(1);
    expect(strategy).toBe(undefined);
  });

  test("Should delete strategy by id.", async () => {
    (StrategyModel.destroy as jest.Mock).mockResolvedValue(null);
    await repository.deleteStrategyById(1);
    expect(StrategyModel.destroy).toHaveBeenCalledTimes(1);
    expect(StrategyModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("Should update strategy by id.", async () => {
    (StrategyModel.update as jest.Mock).mockResolvedValue(null);
    await repository.updateStrategyById(1, { name: "new name" });
    expect(StrategyModel.update).toHaveBeenCalledTimes(1);
    expect(StrategyModel.update).toHaveBeenCalledWith({ name: "new name" }, { where: { id: 1 } });
  });

  describe("searchStrategies", () => {
    test("Should search strategies without any params.", async () => {
      const strategies = mockStrategies(5);
      (StrategyModel.findAll as jest.Mock).mockResolvedValue(strategies.map((strategy) => ({ dataValues: strategy })));
      await repository.searchStrategies({});
      
      expect(StrategyModel.findAll).toHaveBeenCalledTimes(1);
      expect(StrategyModel.findAll).toHaveBeenCalledWith({
        where: {},
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });

    test("Should properly build search params.", async () => {
      const strategies = mockStrategies(5);
      const ids = [1, 2];
      const names = ["strategy 1", "strategy 2"];
      const from = new Date().toISOString();
      const to = new Date().toISOString();
      const marketIds = [1, 2];
      const assets = ["BTCUSDT"];

      (StrategyModel.findAll as jest.Mock).mockResolvedValue(strategies.map((strategy) => ({ dataValues: strategy })));

      const where = {
        id: { [Op.in]: ids },
        name: { [Op.in]: names },
        createdAt: { [Op.gte]: from, [Op.lte]: to },
        marketId: { [Op.in]: marketIds },
        assets: { [Op.contains]: assets }
      };

      await repository.searchStrategies({ 
        ids, names, from, to, marketIds, assets
      });

      expect(StrategyModel.findAll).toHaveBeenCalledTimes(1);
      expect(StrategyModel.findAll).toHaveBeenCalledWith({
        where,
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });
  });
});
