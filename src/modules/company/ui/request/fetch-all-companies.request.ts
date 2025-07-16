import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { SortOrderEnum } from 'src/shared/types/sort-order.enum';

export class FetchAllCompanyRequest {
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsOptional()
  sortOrder?: SortOrderEnum = SortOrderEnum.DESC;
}
