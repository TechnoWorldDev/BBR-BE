import { IsString, MaxLength, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateRankingCategoryTypeRequest {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  key?: string;
}
