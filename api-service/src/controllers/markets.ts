import { Body, Delete, Get, Middlewares, Path, Post, Put, Queries, Response, Route, SuccessResponse } from "tsoa";

import { ApplicationError } from "../common";
import { MarketResponseDto } from "../dtos";
import { parseQueryParams, validateQueryParams, validateRequestBody } from "../middlewares";
import { MarketsService } from "../services";
import { HttpStatusCode, Market, SearchMarketsOptions } from "../types";
import { CreateMarketRequestValidator, SearchMarketsRequestValidator, UpdateMarketRequestValidator } from "../validators";

const validateCreateMarket = validateRequestBody(CreateMarketRequestValidator);
const validateUpdateMarket = validateRequestBody(UpdateMarketRequestValidator);
const validateMarketQueryParams = validateQueryParams(SearchMarketsRequestValidator);

@Route("markets")
export class MarketsController {
  private marketsService = new MarketsService();

  /**
   * Create a new market
   * @summary Returns created market
   */
  @Post()
  @Middlewares([validateCreateMarket])
  @SuccessResponse("201")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  public async createMarket(@Body() body: Pick<Market, "name" | "url">): Promise<MarketResponseDto> {
    const market = await this.marketsService.createMarket({ name: body.name, url: body.url });
    return new MarketResponseDto(market);
  }

  /**
   * Get a market by id
   * @summary Returns market by id
   */
  @Get("{id}")
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Market is not found.")
  public async getMarketById(@Path() id: number): Promise<MarketResponseDto> {
    const market = await this.marketsService.getMarketById(id);
    return new MarketResponseDto(market);
  }

  /**
   * Get array of markets
   * @summary Returns markets array filtered by query params
   */
  @Get()
  @Middlewares([parseQueryParams, validateMarketQueryParams])
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.BAD_REQUEST, "Invalid payload")
  public async searchMarkets(@Queries() queryParams: SearchMarketsOptions): Promise<MarketResponseDto[]> {
    const markets = await this.marketsService.searchMarkets(queryParams, queryParams?.order as "ASC" | "DESC" || "DESC");
    return markets.map((market) => new MarketResponseDto(market));
  }

  /**
   * Delete market by id
   * @summary Deletes market by it's id, returns empty response
   */
  @Delete("{id}")
  @SuccessResponse("204")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Market is not found.")
  public async deleteMarketById(@Path() id: number): Promise<void> {
    await this.marketsService.deleteMarketById(id);
  }

  /**
   * Update market by id
   * @summary Returns updated market
   */
  @Put("{id}")
  @Middlewares([validateUpdateMarket])
  @SuccessResponse("200")
  @Response<ApplicationError>(HttpStatusCode.NOT_FOUND, "Market is not found.")
  public async updateMarketById(@Path() id: number, @Body() body: Pick<Market, "name" | "url">): Promise<MarketResponseDto> {
    await this.marketsService.updateMarketById(id, body);
    const market = await this.marketsService.getMarketById(id);
    return new MarketResponseDto(market);
  }
}
