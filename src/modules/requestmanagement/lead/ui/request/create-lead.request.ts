import { IsString, IsOptional, IsEmail, IsNotEmpty, IsArray } from 'class-validator';


export class CreateLeadRequest {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredContactMethod: string[];
}
