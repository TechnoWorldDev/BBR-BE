import { IsNotEmpty } from 'class-validator';

export class UpdateUnitTypeRequest {
  @IsNotEmpty()
  name: string;
}
