import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsDate,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateCountryRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  code: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  tld: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  currencyCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  currencyName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  currencySymbol: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  capital: string;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(16, { each: true })
  phoneCodes: string[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  subregion: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  flag: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  continentId: string;
}
