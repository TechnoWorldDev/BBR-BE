import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateRankingCriteriaRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isDefault: boolean;

  @IsNotEmpty()
  @IsString()
  description: string;
}
