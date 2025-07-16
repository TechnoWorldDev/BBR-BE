import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateLifestyleRequest {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  order: number;
}
