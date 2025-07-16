import { IsEmail, IsNotEmpty, IsString, IsUrl, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateCareerContactFormRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsString()
  linkedin: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsUUID()
  cvId: string | null;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsUrl()
  websiteURL: string;
}
