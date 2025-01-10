import { Request, Response } from "express";

import { StrategiesDto } from "../dtos";
import { StrategiesService } from "../services";

export class StrategiesController {
  private strategiesService = new StrategiesService();

  public async createStrategy(req: Request, res: Response): Promise<void> {
    const strategy = await this.strategiesService.createStrategy(req.body);
    res.status(201).send(new StrategiesDto(strategy));
  }

  public async getStrategyById(req: Request, res: Response): Promise<void> {
    const strategy = await this.strategiesService.getStrategyById(Number(req.params.id));
    res.status(200).send(new StrategiesDto(strategy));
  }

  public async searchStrategies(req: Request, res: Response): Promise<void> {
    const strategies = await this.strategiesService.searchStrategies(req.query, req.query?.order as "ASC" | "DESC" || "DESC");
    res.status(200).send(strategies.map((strategy) => new StrategiesDto(strategy)));
  }

  public async deleteStrategyById(req: Request, res: Response): Promise<void> {
    await this.strategiesService.deleteStrategyById(Number(req.params.id));
    res.status(204).send();
  }

  public async activateStrategyById(req: Request, res: Response): Promise<void> {
    const strategy = await this.strategiesService.activateStrategyById(Number(req.params.id));
    res.status(200).send(new StrategiesDto(strategy));
  }

  public async disableStrategyById(req: Request, res: Response): Promise<void> {
    const strategy = await this.strategiesService.disableStrategyById(Number(req.params.id));
    res.status(200).send(new StrategiesDto(strategy));
  }
}
