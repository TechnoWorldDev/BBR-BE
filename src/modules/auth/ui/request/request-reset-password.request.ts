import { IsEmail } from 'class-validator';

export class RequestResetPasswordRequest {
  @IsEmail()
  email: string;
}
