import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBrandTypeRequest {
  @IsOptional()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;
}
