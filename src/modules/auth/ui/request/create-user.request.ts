import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(64, { message: 'First name must be at most 64 characters long' })
  fullName: string;

  @IsOptional()
  @MaxLength(64, { message: 'Company name must be at most 64 characters long' })
  companyName?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(128, { message: 'Email must be at most 128 characters long' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string;
}
