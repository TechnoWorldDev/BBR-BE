import { IsString } from 'class-validator';

export class ResetPasswordRequest {
  @IsString()
  resetToken: string;

  @IsString()
  newPassword: string;
}
