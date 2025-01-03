import { Request, Response } from "express";

import { MarketResponseDto } from "../dtos";
import { MarketsService } from "../services";

export class MarketsController {
  private marketsService = new MarketsService();

  public async createMarket(req: Request, res: Response): Promise<void> {
    const { name, url } = req.body;
    const market = await this.marketsService.createMarket({ name, url });
    res.status(201).send(new MarketResponseDto(market));
  }

  public async getMarketById(req: Request, res: Response): Promise<void> {
    const market = await this.marketsService.getMarketById(Number(req.params.id));
    res.status(200).send(new MarketResponseDto(market));
  }

  public async searchMarkets(req: Request, res: Response): Promise<void> {
    const markets = await this.marketsService.searchMarkets(req.query, req.query?.order as "ASC" | "DESC" || "DESC");
    res.status(200).send(markets.map((market) => new MarketResponseDto(market)));
  }

  public async deleteMarketById(req: Request, res: Response): Promise<void> {
    await this.marketsService.deleteMarketById(Number(req.params.id));
    res.status(204).send();
  }

  public async updateMarketById(req: Request, res: Response): Promise<void> {
    await this.marketsService.updateMarketById(Number(req.params.id), req.body);
    const market = await this.marketsService.getMarketById(Number(req.params.id));
    res.status(200).send(new MarketResponseDto(market));
  }
}
