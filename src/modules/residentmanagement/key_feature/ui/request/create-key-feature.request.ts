import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKeyFeatureRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}
