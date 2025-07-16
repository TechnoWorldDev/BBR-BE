import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPasswordRequest {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;
}
