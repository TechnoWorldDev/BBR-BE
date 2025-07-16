import { IsEmail, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class UpdateCompanyProfileRequest {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsUUID()
  imageId: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  phoneNumberCountryCode: string;

  @IsOptional()
  @IsUrl()
  website: string;

  @IsOptional()
  @IsUUID()
  contactPersonAvatarId: string;

  @IsOptional()
  @IsString()
  contactPersonFullName: string;

  @IsOptional()
  @IsString()
  contactPersonJobTitle: string;

  @IsOptional()
  @IsEmail()
  contactPersonEmail: string;

  @IsOptional()
  @IsString()
  contactPersonPhoneNumber: string;

  @IsOptional()
  @IsString()
  contactPersonPhoneNumberCountryCode: string;
}
