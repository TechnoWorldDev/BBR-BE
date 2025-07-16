import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBrandTypeRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;
}
