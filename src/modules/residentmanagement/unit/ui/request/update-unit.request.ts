import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { UnitStatusEnum } from '../../domain/unit-status.enum';
import { UnitTransactionTypeEnum } from '../../domain/unit-transaction-type.enum';
import { UnitServicesRequest } from './unit-services.request';

export class UpdateUnitRequest {
  @IsOptional()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  surface: number;

  @IsOptional()
  @IsEnum(UnitStatusEnum)
  status: UnitStatusEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  regularPrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  exclusivePrice: number;

  @IsOptional()
  @Type(() => Date)
  exclusiveOfferStartDate: Date;

  @IsOptional()
  @Type(() => Date)
  exclusiveOfferEndDate: Date;

  @IsOptional()
  @IsString()
  roomType: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  roomAmount: number;

  @IsOptional()
  @IsUUID()
  unitTypeId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnitServicesRequest)
  services: UnitServicesRequest[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  galleryMediaIds: string[];

  @IsOptional()
  @IsUUID()
  featureImageId: string;

  @IsOptional()
  @IsUUID()
  residenceId: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  bathrooms: string;

  @IsOptional()
  @IsString()
  bedroom: string;

  @IsOptional()
  @IsString()
  floor: string;

  @IsOptional()
  @IsEnum(UnitTransactionTypeEnum)
  transactionType: UnitTransactionTypeEnum = UnitTransactionTypeEnum.SALE;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characteristics: string[];
}
