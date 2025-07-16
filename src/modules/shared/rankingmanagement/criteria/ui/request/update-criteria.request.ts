import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class updateRankingCriteriaRequest {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isDefault: boolean;

  @IsOptional()
  @IsString()
  description: string;
}
