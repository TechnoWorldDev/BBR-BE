import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

import { RequestStatusEnum } from '../../domain/request-status.enum';

export class UpdateRequestStatusRequest {

  @IsNotEmpty()
  @IsEnum(RequestStatusEnum)
  status: RequestStatusEnum;
}
