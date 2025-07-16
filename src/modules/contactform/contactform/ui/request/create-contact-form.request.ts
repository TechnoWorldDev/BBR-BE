import { IsEmail, IsNotEmpty, IsString, IsUrl, MaxLength, IsUUID, IsEnum } from 'class-validator';
import { ContactFormType } from '../../domain/contact-form-type.enum';

export class CreateContactFormRequest {
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
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description: string;

  @IsUUID()
  attachmentId: string;

  @IsNotEmpty()
  @IsEnum(ContactFormType)
  type: ContactFormType;
}
