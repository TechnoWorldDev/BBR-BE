import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateAmenityRequest {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsUUID()
  iconId: string;

  @IsOptional()
  @IsUUID()
  featuredImageId: string;
}
