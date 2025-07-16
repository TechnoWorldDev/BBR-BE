import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class HighlightedAmenityRequest {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
