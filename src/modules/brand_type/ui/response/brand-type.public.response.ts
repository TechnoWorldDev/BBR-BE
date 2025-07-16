import { BrandPublicResponse } from '../../../brand/ui/response/brand.public.response';

export class BrandTypePublicResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly brands?: BrandPublicResponse[]
  ) {}
}
