import { Body, Delete, Get, Middlewares, Path, Post, Queries, Response, Route, SuccessResponse } from "tsoa";

import { ApplicationError } from "../common";
import { StrategiesDto } from "../dtos";
import { parseQueryParams, validateQueryParams, validateStrategyPaylod } from "../middlewares";
import { StrategiesService } from "../services";
import { HttpStatusCode, SearchStrategiesOptions, Strategy } from "../types";
import { SearchStrategiesRequestValidator } from "../validators";

const validateStrategyQueryParams = validateQueryParams(SearchStrategiesRequestValidator);

@Route("strategies")
export class StrategiesController {
  private strategiesService = new StrategiesService();

  /**
  * Create a new strategy
  * @summary Returns created strategy
  */
  @Post()
  @Middlewares([validateStrategyPaylod])
  @SuccessResponse("201")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid market id")
  public async createStrategy(@Body() body: Omit<Strategy, "id" | "createdAt" | "updatedAt" | "isActive">): Promise<StrategiesDto> {
    const strategy = await this.strategiesService.createStrategy(body);
    return new StrategiesDto(strategy);
  }
  
  /**
  * Get a strategy by id
  * @summary Returns strategy by id
  */
  @Get("{id}")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Strategy is not found.")
  public async getStrategyById(@Path() id: number): Promise<StrategiesDto> {
    const strategy = await this.strategiesService.getStrategyById(id);
    return new StrategiesDto(strategy);
  }

  /**
  * Get array of strategies
  * @summary Returns strategies array filtered by query params
  */
  @Get()
  @Middlewares([parseQueryParams, validateStrategyQueryParams])
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  public async searchStrategies(@Queries() queryParams: SearchStrategiesOptions): Promise<StrategiesDto[]> {
    const strategies = await this.strategiesService.searchStrategies(queryParams, queryParams?.order as "ASC" | "DESC" || "DESC");
    return strategies.map((strategy) => new StrategiesDto(strategy));
  }

  /**
  * Delete strategy by id
  * @summary Deletes strategy by it's id, returns empty response
  */
  @Delete("{id}")
  @SuccessResponse("204")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Strategy is not found.")
  public async deleteStrategyById(@Path() id: number): Promise<void> {
    await this.strategiesService.deleteStrategyById(id);
  }

  /**
  * Activate strategy by id
  * @summary Returns activated strategy
  */
  @Post("{id}/activate")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Strategy is not found.")
  public async activateStrategyById(@Path() id: number): Promise<StrategiesDto> {
    const strategy = await this.strategiesService.activateStrategyById(id);
    return new StrategiesDto(strategy);
  }

  /**
  * Disable strategy by id
  * @summary Returns disabled strategy
  */
  @Post("{id}/disable")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Strategy is not found.")
  public async disableStrategyById(@Path() id: number): Promise<StrategiesDto> {
    const strategy = await this.strategiesService.disableStrategyById(id);
    return new StrategiesDto(strategy);
  }
}
