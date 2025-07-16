import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID, Max,
  MaxLength, Min,
} from 'class-validator';

export class CreateReviewRequest {
  @IsNotEmpty()
  @IsUUID()
  residenceId: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfPurchase: Date;

  @IsNotEmpty()
  @IsUUID()
  unitTypeId: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrimaryResidence: boolean;

  @IsNotEmpty()
  @IsBoolean()
  verifiedOwnerOrTenant: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  buildQuality: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  purchaseExperienceRating: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  amenities: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  neighbourhoodLocation: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  valueForMoney: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  serviceQuality: number;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  additionalFeedback: string | null;
}
