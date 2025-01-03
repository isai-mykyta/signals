import { Type } from "class-transformer";
import { 
  IsArray,
  IsDateString,
  IsEnum, 
  IsIn, 
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  Length, 
  Min, 
  ValidateNested
} from "class-validator";

import {
  ActionType,
  Comprasion,
  StrategyAction, 
  StrategyRule, 
  StrategyRuleType, 
  TaskSchedule, 
  TaskType,
  TimeFrame,
  TimeFrameUnit, 
} from "../types";

export class CreateStrategyRequestValidator {
  @IsNotEmpty()
  @IsString()
  @Length(0, 40)
  public name: string;

  @IsNotEmpty()
  @IsInt()
  public marketId: number;

  @IsNotEmpty()
  @IsString({ each: true })
  public assets: string[];

  @IsNotEmpty()
  @IsEnum(TaskType)
  public taskType: TaskType;

  @IsOptional()
  @ValidateNested()
  @Type(() => TaskScheduleValidator)
  public taskSchedule?: TaskSchedule;

  @IsNotEmpty()
  @IsArray()
  public actions: StrategyAction;

  @IsNotEmpty()
  @IsArray()
  public rules: StrategyRule;
}

export class StrategyRulesValidator {
  @IsEnum(StrategyRuleType)
  @IsNotEmpty()
  public type: StrategyRuleType;
}

export class PricePercentageChangeRuleValidator extends StrategyRulesValidator {
  @IsNumber()
  @IsNotEmpty()
  public value: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TimeFrameValidator)
  public timeFrame: TimeFrame;

  @IsEnum(Comprasion)
  @IsNotEmpty()
  public comparison: Comprasion;
}

export class TimeFrameValidator {
  @IsInt()
  @IsNotEmpty()
  public amount: number;

  @IsEnum(TimeFrameUnit)
  @IsNotEmpty()
  public unit: TimeFrameUnit;
}

export class TaskScheduleValidator {
  @IsInt()
  @IsOptional()
  public startAt?: number;

  @IsInt()
  @IsOptional()
  public endAt?: number;
}

export class StrategyActionValidator {
  @IsEnum(ActionType)
  @IsNotEmpty()
  public type: ActionType;
}

export class TelegramNotificationActionValidator extends StrategyActionValidator {
  @IsNotEmpty()
  public payload: any;
}

export class SearchStrategiesRequestValidator {
  @IsInt({ each: true })
  @IsOptional()
  public ids: number[];

  @IsString({ each: true })
  @IsOptional()
  public names: string[];

  @IsInt({ each: true })
  @IsOptional()
  public marketIds: number[];

  @IsString({ each: true })
  @IsOptional()
  public assets: string[];

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
  
  @IsOptional()
  @IsString()
  @IsIn(["ASC", "DESC"])
  public order?: "ASC" | "DESC";
}
