import {
  IsEmail, IsEnum, IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { B2BFormSubmissionStatus } from '../../domain/b2b-form-submission-status.enum';

export class UpdateB2BFormSubmissionRequest {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(B2BFormSubmissionStatus)
  status: B2BFormSubmissionStatus;

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
  companyWebsite: string | null;

  @IsString()
  @MaxLength(500)
  pageOrigin: string;
}
