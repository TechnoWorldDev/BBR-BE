import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarketingLeadRequest {
  @ApiProperty({
    description: 'Full name of the contact person',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Phone number of the contact person',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address of the marketing lead',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Luxury Residences Inc.',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'Name of the branded residence',
    example: 'Marina Bay Luxury Residences',
  })
  @IsString()
  @IsNotEmpty()
  brandedResidenceName: string;

  @ApiProperty({
    description: 'Company website URL (optional)',
    example: 'https://www.yourcompany.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyWebsite?: string;
} 