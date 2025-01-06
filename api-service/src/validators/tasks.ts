import { 
  IsArray,
  IsBoolean, 
  IsDateString, 
  IsEnum, 
  IsIn, 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Min 
} from "class-validator";

import { TaskStatus } from "../types";

export class CreateTaskValidator {
  @IsInt()
  @IsNotEmpty()
  public strategyId: number;
}

export class SearchTasksValidator {
  @IsInt({ each: true })
  @IsOptional()
  @IsArray()
  public ids: number[];

  @IsInt({ each: true })
  @IsOptional()
  @IsArray()
  public strategyIds?: number[];

  @IsDateString()
  @IsOptional()
  public startedAtFrom?: string;

  @IsDateString()
  @IsOptional()
  public endedAtFrom?: string;

  @IsDateString()
  @IsOptional()
  public lastSignalAtFrom?: string;

  @IsEnum(TaskStatus, { each: true })
  @IsOptional()
  @IsArray()
  public statuses?: TaskStatus[];

  @IsBoolean()
  @IsOptional()
  public isActive?: boolean;

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
