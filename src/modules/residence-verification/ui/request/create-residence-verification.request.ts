import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsNumber,
  IsBoolean,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationTypeEnum } from '../../domain/verification-type.enum';

export class CreateResidenceVerificationRequest {
  @ApiProperty({
    description: 'Property ID (residence ID) - leave empty for new residence',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.propertyId !== undefined && o.propertyId !== '')
  @IsUUID()
  propertyId?: string;

  @ApiProperty({
    description: 'Property name',
    example: 'Sunset Apartments',
  })
  @IsNotEmpty()
  @IsString()
  propertyName: string;

  @ApiProperty({
    description: 'Country ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  countryId: string;

  @ApiProperty({
    description: 'City ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  cityId: string;

  @ApiProperty({
    description: 'Property address',
    example: '123 Main Street, Downtown',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Plan ID (billing product ID) - not used for verification but kept for consistency',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  planId?: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Verification type',
    enum: VerificationTypeEnum,
    example: VerificationTypeEnum.VIRTUAL,
  })
  @IsNotEmpty()
  @IsEnum(VerificationTypeEnum)
  verificationType: VerificationTypeEnum;

  @ApiProperty({
    description: 'Additional notes for verification',
    example: 'Please verify the property features and amenities',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiProperty({
    description: 'Meeting link for virtual verification',
    example: 'https://zoom.us/j/123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  meetingLink?: string;

  @ApiProperty({
    description: 'Platform for virtual verification (zoom, teams, etc.)',
    example: 'zoom',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  platform?: string;

  @ApiProperty({
    description: 'Scheduled date for virtual verification',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiProperty({
    description: 'Scheduled time for virtual verification',
    example: '14:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  scheduledTime?: string;

  @ApiProperty({
    description: 'Preferred date for physical verification',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @ApiProperty({
    description: 'Preferred time for physical verification',
    example: '14:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  preferredTime?: string;

  @ApiProperty({
    description: 'Number of visitors for physical verification',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  numberOfVisitors?: number;

  @ApiProperty({
    description: 'Agreement to terms and conditions',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  agree: boolean;

  @ApiProperty({
    description: 'Stripe payment method ID from frontend card element',
    example: 'pm_1234567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiProperty({
    description: 'Stripe payment intent ID from frontend',
    example: 'pi_1234567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}
