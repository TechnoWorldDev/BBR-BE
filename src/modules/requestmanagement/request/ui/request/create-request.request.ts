import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
   IsUUID,
  IsArray,
} from 'class-validator';
import { RequestTypeEnum } from '../../domain/request-type.enum';

export class CreateRequestRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  subject: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  message: string;

  @IsOptional()
  @IsUUID()
  entityId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredContactMethod: string[];

  @IsNotEmpty()
  @IsBoolean()
  termsAccepted: boolean;

  @IsNotEmpty()
  @IsEnum(RequestTypeEnum)
  type: RequestTypeEnum;
}
