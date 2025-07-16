import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';

export class ScoreEntry {
  @IsUUID()
  @IsString()
  rankingCriteriaId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  score: number;
}
export class ScoreResidenceRequest {
  @IsString()
  @IsUUID()
  residenceId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreEntry)
  scores: ScoreEntry[];
}

export class ScoreMultipleResidencesRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreResidenceRequest)
  items: ScoreResidenceRequest[];
}
