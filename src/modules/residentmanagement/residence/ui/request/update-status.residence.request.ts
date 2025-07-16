import { IsEnum } from 'class-validator';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';

export class UpdateStatusResidenceRequest {
  @IsEnum(ResidenceStatusEnum)
  status: ResidenceStatusEnum;
}
