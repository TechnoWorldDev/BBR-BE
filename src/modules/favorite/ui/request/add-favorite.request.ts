import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddFavoriteRequest {
  @IsNotEmpty()
  @IsUUID()
  entityId: string;

  @IsNotEmpty()
  @IsString()
  entityType: string;
}
