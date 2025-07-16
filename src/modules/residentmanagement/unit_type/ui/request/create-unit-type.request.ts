import { IsNotEmpty } from 'class-validator';

export class CreateUnitTypeRequest {
  @IsNotEmpty()
  name: string;
}
