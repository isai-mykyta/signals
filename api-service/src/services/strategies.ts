import { ApplicationError } from "../common";
import { strategiesProducer } from "../producers";
import { MarketsRepository, StrategiesRepository } from "../repositories";
import { CustomErrorType, SearchStrategiesOptions, Strategy } from "../types";

export class StrategiesService {
  private strategiesRepository = new StrategiesRepository();
  private marketsRepository = new MarketsRepository();

  public async createStrategy(options: Partial<Strategy>): Promise<Strategy> {
    const market = await this.marketsRepository.getMarketById(options.marketId);

    if (!market) {
      throw new ApplicationError({
        message: "Invalid market id.",
        type: CustomErrorType.VALIDATION_ERROR,
      });
    }

    const strategy = await this.strategiesRepository.createStrategy(options);
    await strategiesProducer.sendCreationMessage(strategy);
    return strategy;
  }

  public async getStrategyById(id: number): Promise<Strategy> {
    const strategy = await this.strategiesRepository.getStrategyById(id);

    if (!strategy) {
      throw new ApplicationError({
        message: "Strategy is not found",
        type: CustomErrorType.NOT_FOUND
      });
    }

    return strategy;
  }
  
  public async searchStrategies(options: SearchStrategiesOptions, order: "ASC" | "DESC" = "DESC"): Promise<Strategy[]> {
    return this.strategiesRepository.searchStrategies(options, order);
  }
  
  public async deleteStrategyById(id: number): Promise<void> {
    await this.getStrategyById(id);
    await this.strategiesRepository.deleteStrategyById(id);
  }
  
  public async updateStrategyById(id: number, options: Partial<Strategy>): Promise<void> {
    await this.getStrategyById(id);
    await this.strategiesRepository.updateStrategyById(id, options);
  }

  public async activateStrategyById(id: number): Promise<Strategy> {
    await this.updateStrategyById(id, { isActive: true });
    return await this.getStrategyById(id);
  }

  public async disableStrategyById(id: number): Promise<Strategy> {
    await this.updateStrategyById(id, { isActive: false });
    return await this.getStrategyById(id);
  }
}
