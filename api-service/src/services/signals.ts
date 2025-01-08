import { ApplicationError } from "../common";
import { 
  MarketsRepository, 
  SignalsRepository, 
  StrategiesRepository, 
  TasksRepository 
} from "../repositories";
import { CustomErrorType, SearchSignalsOptions, Signal } from "../types";

export class SignalsService {
  private signalsRepository = new SignalsRepository();
  private strategiesRepository = new StrategiesRepository();
  private tasksRepository = new TasksRepository();
  private marketsRepository = new MarketsRepository();

  public async createSignal(options: Partial<Signal>): Promise<Signal> {
    const strategy = await this.strategiesRepository.getStrategyById(options.strategyId);
    
    if (!strategy) {
      throw new ApplicationError({
        type: CustomErrorType.VALIDATION_ERROR,
        message: "Invalid strategy id."
      });
    }

    const task = await this.tasksRepository.getTaskById(options.taskId);

    if (!task) {
      throw new ApplicationError({
        type: CustomErrorType.VALIDATION_ERROR,
        message: "Invalid task id."
      });
    }

    const market = await this.marketsRepository.getMarketById(options.marketId);

    if (!market) {
      throw new ApplicationError({
        type: CustomErrorType.VALIDATION_ERROR,
        message: "Invalid market id."
      });
    }

    return await this.signalsRepository.createSignal(options);
  }

  public async getSignalById(id: number): Promise<Signal> {
    const signal = await this.signalsRepository.getSignalById(id);

    if (!signal) {
      throw new ApplicationError({
        type: CustomErrorType.NOT_FOUND,
        message: "Signal is not found."
      });
    }

    return signal;
  }

  public async deleteSignalById(id: number): Promise<void> {
    await this.getSignalById(id);
    await this.signalsRepository.deleteSignalById(id);
  }

  public async searchSignals(options: SearchSignalsOptions, order: "ASC" | "DESC" = "DESC"): Promise<Signal[]> {
    return this.signalsRepository.searchSignals(options, order);
  }
}
