import { IsNotEmpty, IsString, MaxLength, IsUUID, IsEnum, IsEmail } from 'class-validator';
import { ClaimProfileContactFormStatus } from '../../domain/claim-profile-contact-form-status.enum';

export class UpdateClaimProfileContactFormRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phoneNumber: string;

  @IsUUID()
  phoneCodeId: string;

  @IsNotEmpty()
  @IsString()
  websiteUrl: string;

  @IsUUID()
  cvId: string;

  @IsNotEmpty()
  @IsEnum(ClaimProfileContactFormStatus)
  status: ClaimProfileContactFormStatus;
}
