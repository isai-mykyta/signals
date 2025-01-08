import { Request, Response } from "express";

import { SignalsDto } from "../dtos";
import { SignalsService } from "../services";

export class SignalsController {
  private signalsService = new SignalsService();

  public async createSignal(req: Request, res: Response): Promise<void> {
    const signal = await this.signalsService.createSignal(req.body);
    res.status(201).send(new SignalsDto(signal));
  }

  public async getSignalById(req: Request, res: Response): Promise<void> {
    const signal = await this.signalsService.getSignalById(Number(req.params.id));
    res.status(200).send(new SignalsDto(signal));
  }
  
  public async searchSignals(req: Request, res: Response): Promise<void> {
    const signals = await this.signalsService.searchSignals(req.query, req.query?.order as "ASC" | "DESC" || "DESC");
    res.status(200).send(signals.map((signal) => new SignalsDto(signal)));
  }

  public async deleteSignalById(req: Request, res: Response): Promise<void> {
    await this.signalsService.deleteSignalById(Number(req.params.id));
    res.status(204).send();
  }
}
