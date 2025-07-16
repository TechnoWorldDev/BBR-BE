import { IsString, MaxLength, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateRankingCategoryTypeRequest {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  key?: string;
}
