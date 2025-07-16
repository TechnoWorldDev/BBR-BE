import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional, IsUrl,
} from 'class-validator';

export class CreateB2BFormSubmissionRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  companyName: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  brandedResidencesName: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @IsUrl()
  companyWebsite: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  pageOrigin: string;
}
