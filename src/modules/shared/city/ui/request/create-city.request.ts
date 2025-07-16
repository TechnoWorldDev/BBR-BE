import { IsNotEmpty, IsString, MaxLength, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateCityRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  asciiName: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  countryId: string;

  @IsNotEmpty()
  @IsInt()
  population: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  timezone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  xCoordinate: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  yCoordinate: string;
}
