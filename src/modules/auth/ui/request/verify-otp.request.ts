import { IsString } from 'class-validator';

export class VerifyOtpRequest {
  @IsString()
  otp: string;

  @IsString()
  resetToken: string;
}
