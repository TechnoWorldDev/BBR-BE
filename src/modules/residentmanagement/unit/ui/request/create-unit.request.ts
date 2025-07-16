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

export class CreateUnitRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  slug: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  surface: number;

  @IsNotEmpty()
  @IsEnum(UnitStatusEnum)
  status: UnitStatusEnum;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  roomType: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  roomAmount: number;

  @IsNotEmpty()
  @IsUUID()
  unitTypeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnitServicesRequest)
  services: UnitServicesRequest[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty()
  galleryMediaIds: string[];

  @IsNotEmpty()
  @IsUUID()
  featureImageId: string;

  @IsNotEmpty()
  @IsUUID()
  residenceId: string;

  @IsNotEmpty()
  @IsString()
  about: string;

  @IsNotEmpty()
  @IsString()
  bathrooms: string;

  @IsNotEmpty()
  @IsString()
  bedroom: string;

  @IsNotEmpty()
  @IsString()
  floor: string;

  @IsNotEmpty()
  @IsEnum(UnitTransactionTypeEnum)
  transactionType: UnitTransactionTypeEnum = UnitTransactionTypeEnum.RENT;

  @IsArray()
  @IsString({ each: true })
  characteristics: string[];
}
