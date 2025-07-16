import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class AcceptInviteRequest {
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string;
}
