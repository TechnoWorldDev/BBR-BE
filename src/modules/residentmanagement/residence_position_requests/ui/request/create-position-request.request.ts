import { IsOptional, IsUUID } from 'class-validator';

export class CreatePositionRequestRequest {
  @IsUUID()
  residenceId: string;

  @IsUUID()
  rankingCategoryId: string;

  @IsUUID()
  @IsOptional()
  requestedBy: string;
}
