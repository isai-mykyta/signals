import { Body, Delete, Get, Middlewares, Path, Post, Queries, Response, Route, SuccessResponse } from "tsoa";

import { ApplicationError } from "../common";
import { SignalsDto } from "../dtos";
import { parseQueryParams, validateQueryParams, validateRequestBody } from "../middlewares";
import { SignalsService } from "../services";
import { HttpStatusCode, SearchSignalsOptions, Signal } from "../types";
import { CreateSignalRequestValidator, SearchSignalsRequestValidator } from "../validators";

const validateCreateSignal = validateRequestBody(CreateSignalRequestValidator); 
const validateSignalQueryParams = validateQueryParams(SearchSignalsRequestValidator);

@Route("signals")
export class SignalsController {
  private signalsService = new SignalsService();

  /**
  * Create a new signal
  * @summary Returns created signal
  */
  @Post()
  @Middlewares([validateCreateSignal])
  @SuccessResponse("201")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid strategy id")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid task id")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid market id")
  public async createSignal(@Body() body: Omit<Signal, "id" | "createdAt" | "updatedAt">): Promise<SignalsDto> {
    const signal = await this.signalsService.createSignal(body);
    return new SignalsDto(signal);
  }

  /**
   * Get a signal by id
   * @summary Returns signal by id
   */
  @Get("{id}")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Signal is not found.")
  public async getSignalById(@Path() id: number): Promise<SignalsDto> {
    const signal = await this.signalsService.getSignalById(id);
    return new SignalsDto(signal);
  }
  
  /**
  * Get array of signals
  * @summary Returns signals array filtered by query params
  */
  @Get()
  @Middlewares([parseQueryParams, validateSignalQueryParams])
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  public async searchSignals(@Queries() queryParams: SearchSignalsOptions): Promise<SignalsDto[]> {
    const signals = await this.signalsService.searchSignals(queryParams, queryParams?.order as "ASC" | "DESC" || "DESC");
    return signals.map((signal) => new SignalsDto(signal));
  }

  /**
  * Delete signal by id
  * @summary Deletes signal by it's id, returns empty response
  */
  @Delete("{id}")
  @SuccessResponse("204")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Signal is not found.")
  public async deleteSignalById(@Path() id: number): Promise<void> {
    await this.signalsService.deleteSignalById(id);
  }
}
