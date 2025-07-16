import { IsNotEmpty, IsString, MaxLength, IsUUID, IsEmail } from 'class-validator';

export class CreateClaimProfileContactFormRequest {
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

  @IsString()
  websiteUrl: string;

  @IsUUID()
  cvId: string;

  @IsUUID()
  residenceId: string;
}
