import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class UpdateContactFormRequest {
  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsEmail()
  email: string;

  @IsUrl()
  link: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsUUID()
  attachmentId: string;
}
