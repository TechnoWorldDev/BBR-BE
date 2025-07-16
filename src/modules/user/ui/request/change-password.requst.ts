import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
