import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';

export class CreateUserRequest {
  @IsNotEmpty({ message: 'Full name is required' })
  @MaxLength(64, { message: 'Name must be at most 64 characters long' })
  fullName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(128, { message: 'Email must be at most 128 characters long' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string;

  @IsEnum(SignupMethodEnum, { message: 'Invalid signup method' })
  signupMethod: SignupMethodEnum;

  @IsNotEmpty({ message: 'Role is required' })
  roleId: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications: boolean;
}
