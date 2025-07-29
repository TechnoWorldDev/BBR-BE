import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class PublicApplyForRankingRequest {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  propertyId?: string;

  @ApiProperty({ example: 'demo' })
  @IsString()
  @IsNotEmpty()
  propertyName: string;

  @ApiProperty({ example: 'ea944769-3a97-4925-8152-3847e45de5da' })
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @ApiProperty({ example: 'e26aa081-e2dd-478a-9b57-5734319cc43b' })
  @IsString()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({ example: 'demo sdfsd' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: [String], example: ['36391280-9b5b-41b1-a91c-634ec306b381'] })
  @IsArray()
  @IsString({ each: true })
  selectedCategoryIds: string[];

  @ApiProperty({ example: 'Rajat' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'rajat@mailinator.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Welcom@123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'pm_1RoPDeDqpXm1oeUhRrZC0dBX' })
  @IsString()
  @IsNotEmpty()
  stripePaymentMethodId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  agree: boolean;
} 