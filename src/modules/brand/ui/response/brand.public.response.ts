import { BrandType } from 'src/modules/brand_type/domain/brand-type.entity';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class BrandPublicResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly brandType?: BrandType,
    public readonly logo?: MediaResponse | null
  ) {}
}
