import { IsEmail, IsNotEmpty, IsString, IsUrl, IsOptional, MaxLength, IsUUID, IsEnum } from 'class-validator';
import { CareerContactFormStatusEnum } from '../../domain/career-contact-form-status.enum';

export class UpdateCareerContactFormRequest {

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note: string;

  @IsNotEmpty()
  @IsEnum(CareerContactFormStatusEnum)
  status: CareerContactFormStatusEnum;
}
