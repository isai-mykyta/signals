import { Type } from "class-transformer";
import { 
  IsArray, 
  IsDateString, 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Min, 
  ValidateNested
} from "class-validator";

import { StrategyAction } from "../types";
import { TelegramNotificationActionValidator } from "./strategies";

export class CreateSignalRequestValidator {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  public strategyId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  public taskId: number;

  @IsString()
  @IsNotEmpty()
  public asset: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  public marketId: number;

  @IsDateString()
  @IsOptional()
  public producedAt?: string;

  @IsOptional()
  public metadata?: any;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TelegramNotificationActionValidator)
  public actionsTriggered: StrategyAction[];
}

export class SearchSignalsRequestValidator {
  @IsOptional()
  @IsInt({ each: true })
  @IsArray()
  public ids?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsArray()
  public strategyIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsArray()
  public taskIds?: number[];

  @IsOptional()
  @IsInt({ each: true })
  @IsArray()
  public marketIds?: number[];

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  public assets?: string[];

  @IsString()
  @IsOptional()
  @IsDateString()
  public from?: string;
  
  @IsString()
  @IsOptional()
  @IsDateString()
  public to?: string;
  
  @IsOptional()
  @IsInt()
  @Min(0)
  public limit?: number;
  
  @IsOptional()
  @IsInt()
  @Min(0)
  public offset?: number;
}
