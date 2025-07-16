import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { LeadStatusEnum } from '../../domain/lead-status.enum';

export class UpdateLeadStatusRequest {
  @IsNotEmpty()
  @IsEnum(LeadStatusEnum)
  readonly status: LeadStatusEnum;
}
