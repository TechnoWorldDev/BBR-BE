import { IsNotEmpty } from 'class-validator';

export class CreateRoleRequest {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
