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

export class UpdateUserRequest {
  @IsOptional()
  @MaxLength(64, { message: 'Name must be at most 64 characters long' })
  fullName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(128, { message: 'Email must be at most 128 characters long' })
  email: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(SignupMethodEnum, { message: 'Invalid signup method' })
  signupMethod: SignupMethodEnum;

  @IsOptional()
  @IsNotEmpty({ message: 'Role is required' })
  roleId: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications: boolean;
}
