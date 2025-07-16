import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class CreateRankingCategoryRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;

  @IsUUID()
  @IsNotEmpty()
  rankingCategoryTypeId: string;

  @IsNumber()
  @Type(() => Number)
  residenceLimitation: number;

  @IsNumber()
  @Type(() => Number)
  rankingPrice: number;

  @IsUUID()
  @IsNotEmpty()
  featuredImageId: string;

  @IsNotEmpty()
  @IsEnum(RankingCategoryStatus)
  status: RankingCategoryStatus;

  @IsNotEmpty()
  @IsUUID()
  entityId?: string;
}
