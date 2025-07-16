import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CriteriaWeightRequest {
  @IsUUID()
  @IsString()
  rankingCriteriaId: string;

  @Min(0)
  @Max(100)
  weight: number;

  @IsBoolean()
  @IsOptional()
  isDefault: boolean;
}

export class AssignWeightsRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriteriaWeightRequest)
  criteria: CriteriaWeightRequest[];
}
