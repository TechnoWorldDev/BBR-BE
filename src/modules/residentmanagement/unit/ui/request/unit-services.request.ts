import { IsNumber, IsString } from 'class-validator';

export class UnitServicesRequest {
  @IsString()
  name: string;

  @IsString()
  amount: string;
}
