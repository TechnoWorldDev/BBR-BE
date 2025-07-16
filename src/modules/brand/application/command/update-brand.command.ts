import { BrandStatus } from '../../domain/brand-status.enum';

export class UpdateBrandCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly brandTypeId: string,
    public readonly logoId: string,
    public readonly status: BrandStatus
  ) {}
}
