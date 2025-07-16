import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContinentRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(126)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  code: string;
}
