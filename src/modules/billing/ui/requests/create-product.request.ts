import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';
import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { SubscriptionIntervalEnum } from 'src/shared/types/subscription-interval.enum';

export class CreateProductRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  featureKey: string;

  @IsNotEmpty()
  @IsEnum(BillingProductTypeEnum)
  type: BillingProductTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(SubscriptionIntervalEnum)
  interval?: SubscriptionIntervalEnum;
}
