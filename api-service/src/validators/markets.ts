import { 
  IsDateString, 
  IsIn, 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUrl, 
  Length, 
  Min,
  IsArray
} from "class-validator";

export class CreateMarketRequestValidator {
  @IsString()
  @IsNotEmpty()
  @Length(0, 40)
  public name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  public url: string;
}

export class UpdateMarketRequestValidator {
  @IsString()
  @IsOptional()
  @Length(0, 40)
  public name: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  public url: string;
}

export class SearchMarketsRequestValidator {
  @IsOptional()
  @IsInt({ each: true })
  @IsArray()
  public ids?: string[];

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  public names?: string[];

  @IsString()
  @IsOptional()
  public url?: string;

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
