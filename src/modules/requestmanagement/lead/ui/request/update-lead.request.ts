import { IsString, IsEmail, IsOptional, IsNotEmpty, IsArray } from 'class-validator';


export class UpdateLeadRequest {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly phone: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredContactMethod: string[];
}
