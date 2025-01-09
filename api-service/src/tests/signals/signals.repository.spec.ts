import { Op } from "sequelize";

import { SignalModel } from "../../models";
import { SignalsRepository } from "../../repositories";
import { Signal } from "../../types";
import { mockSignal } from "../fixtures";

jest.mock("../../models", () => ({
  SignalModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn()
  }
}));

const mockSignals = (count: number): Signal[] => {
  return new Array(count).map((_, idx) => (mockSignal(idx)));
};

describe("SignalsRepository", () => {
  let repository: SignalsRepository;

  beforeEach(() => {
    repository = new SignalsRepository();
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create a new signal.", async () => {
    const [signal] = mockSignals(1);
    (SignalModel.create as jest.Mock).mockResolvedValue({ dataValues: signal });
    await repository.createSignal(signal);
    expect(SignalModel.create).toHaveBeenCalledTimes(1);
    expect(SignalModel.create).toHaveBeenCalledWith(signal);
  });

  test("Should return signal by id.", async () => {
    (SignalModel.findOne as jest.Mock).mockResolvedValue({ dataValues: mockSignals(1) });
    await repository.getSignalById(1);
    expect(SignalModel.findOne).toHaveBeenCalledTimes(1);
    expect(SignalModel.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("Should return an undefined if signal by id is not found.", async () => {
    (SignalModel.findOne as jest.Mock).mockResolvedValue(null);
    const signal = await repository.getSignalById(1);
    expect(signal).toBe(undefined);
  });

  test("Should delete signal by id.", async () => {
    (SignalModel.destroy as jest.Mock).mockResolvedValue(null);
    await repository.deleteSignalById(1);
    expect(SignalModel.destroy).toHaveBeenCalledTimes(1);
    expect(SignalModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });
  
  test("Should update signal by id.", async () => {
    (SignalModel.update as jest.Mock).mockResolvedValue(null);
    await repository.updateSignalById(1, { metadata: {} });
    expect(SignalModel.update).toHaveBeenCalledTimes(1);
    expect(SignalModel.update).toHaveBeenCalledWith({ metadata: {} }, { where: { id: 1 } });
  });

  describe("searchSignals", () => {
    test("Should search signals without any params.", async () => {
      const signals = mockSignals(5);
      (SignalModel.findAll as jest.Mock).mockResolvedValue(signals.map((signal) => ({ dataValues: signal })));
      await repository.searchSignals({});
        
      expect(SignalModel.findAll).toHaveBeenCalledTimes(1);
      expect(SignalModel.findAll).toHaveBeenCalledWith({
        where: {},
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });
  
    test("Should properly build search params.", async () => {
      const signals = mockSignals(5);
      const ids = [1, 2];
      const strategyIds = [1, 2];
      const taskIds = [1, 2];
      const marketIds = [1, 2];
      const assets = ["BTCUSDT"];
  
      (SignalModel.findAll as jest.Mock).mockResolvedValue(signals.map((signal) => ({ dataValues: signal })));
  
      const where = {
        id: { [Op.in]: ids },
        strategyId: { [Op.in]: strategyIds },
        taskId: { [Op.in]: taskIds },
        marketId: { [Op.in]: marketIds },
        asset: { [Op.in]: assets }
      };
  
      await repository.searchSignals({ 
        ids, strategyIds, taskIds, marketIds, assets
      });
  
      expect(SignalModel.findAll).toHaveBeenCalledTimes(1);
      expect(SignalModel.findAll).toHaveBeenCalledWith({
        where,
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });
    });
  });
});
