import { IsString, MaxLength, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateAmenityRequest {
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
