import { IsEnum, IsNotEmpty } from 'class-validator';
import { BrandStatus } from '../../domain/brand-status.enum';

export class UpdateBrandStatusRequest {
  @IsNotEmpty()
  @IsEnum(BrandStatus)
  status: BrandStatus;
}
