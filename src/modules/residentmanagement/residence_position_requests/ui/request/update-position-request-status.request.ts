import { IsEnum, IsString } from 'class-validator';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';

export class UpdatePositionRequestStatusRequest {
  @IsString()
  @IsEnum(ResidencePositionRequestStatusEnum)
  status: ResidencePositionRequestStatusEnum;
}
