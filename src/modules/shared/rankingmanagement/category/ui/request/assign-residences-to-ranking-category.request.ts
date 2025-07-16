import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class AssignResidencesToRankingCategoryRequest {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  residenceIds: string[];
}
