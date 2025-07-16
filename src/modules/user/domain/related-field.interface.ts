import { IsUUID, IsString } from 'class-validator';

export class RelatedField {
  @IsUUID()
  related_id: string;

  @IsString()
  related_table: string;
}
