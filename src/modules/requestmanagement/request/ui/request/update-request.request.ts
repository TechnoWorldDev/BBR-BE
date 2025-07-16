import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { RequestStatusEnum } from '../../domain/request-status.enum';

export class UpdateRequestRequest {

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  note: string;

  @IsNotEmpty()
  @IsEnum(RequestStatusEnum)
  status: RequestStatusEnum;
}
