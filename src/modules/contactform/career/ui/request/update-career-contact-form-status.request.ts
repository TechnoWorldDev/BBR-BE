import { IsEmail, IsNotEmpty, IsString, IsUrl, IsOptional, MaxLength, IsUUID, IsEnum } from 'class-validator';
import { CareerContactFormStatusEnum } from '../../domain/career-contact-form-status.enum';

export class UpdateCareerContactFormStatusRequest {
  @IsNotEmpty()
  @IsEnum(CareerContactFormStatusEnum)
  status: CareerContactFormStatusEnum;
}
