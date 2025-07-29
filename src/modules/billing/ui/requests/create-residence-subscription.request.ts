import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsEmail, IsOptional, ValidateIf } from 'class-validator';

export class CreateResidenceSubscriptionRequest {
  @ApiProperty({
    description: 'Property ID (residence ID) - leave empty for new residence',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.propertyId !== undefined && o.propertyId !== '')
  @IsUUID()
  propertyId?: string;

  @ApiProperty({
    description: 'Property name',
    example: 'Sunset Apartments'
  })
  @IsNotEmpty()
  @IsString()
  propertyName: string;

  @ApiProperty({
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  countryId: string;

  @ApiProperty({
    description: 'City ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  cityId: string;

  @ApiProperty({
    description: 'Property address',
    example: '123 Main Street, Downtown'
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Plan ID (billing product ID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  planId: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890'
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Stripe payment method ID',
    example: 'pm_1234567890'
  })
  @IsNotEmpty()
  @IsString()
  stripePaymentMethodId: string;

  @ApiProperty({
    description: 'Agreement to terms',
    example: true
  })
  @IsNotEmpty()
  agree: boolean;
} 