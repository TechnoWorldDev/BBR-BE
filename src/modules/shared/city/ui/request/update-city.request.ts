import { IsString, MaxLength, IsUUID, IsInt } from 'class-validator';

export class UpdateCityRequest {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  asciiName: string;

  @IsString()
  @IsUUID()
  countryId: string;

  @IsInt()
  population: number;

  @IsString()
  @MaxLength(100)
  timezone: string;

  @IsString()
  @MaxLength(20)
  xCoordinate: string;

  @IsString()
  @MaxLength(20)
  yCoordinate: string;
}
