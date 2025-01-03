import { ApplicationError } from "../common";
import { MarketsRepository } from "../repositories";
import { CustomErrorType, Market, SearchMarketsOptions } from "../types";

export class MarketsService {
  private marketsRepository = new MarketsRepository();

  public async createMarket(options: Partial<Market>): Promise<Market> {
    return this.marketsRepository.createMarket(options);
  }

  public async getMarketById(id: number): Promise<Market> {
    const market = await this.marketsRepository.getMarketById(id);

    if (!market) {
      throw new ApplicationError({
        message: "Market is not found.",
        type: CustomErrorType.NOT_FOUND
      });
    }

    return market;
  }

  public async searchMarkets(options: SearchMarketsOptions, order: "ASC" | "DESC" = "DESC"): Promise<Market[]> {
    return this.marketsRepository.searchMarkets(options, order);
  }

  public async deleteMarketById(id: number): Promise<void> {
    await this.getMarketById(id);
    await this.marketsRepository.deleteMarketById(id);
  }

  public async updateMarketById(id: number, options: Partial<Market>): Promise<void> {
    await this.getMarketById(id);
    await this.marketsRepository.updateMarketById(id, options);
  }
}
