import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class UnitResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly surface: number,
    public readonly status: string,
    public readonly regularPrice: number,
    public readonly exclusivePrice: number,
    public readonly exclusiveOfferStartDate: Date,
    public readonly exclusiveOfferEndDate: Date,
    public readonly roomType: string,
    public readonly roomAmount: number,
    public readonly serviceType: string,
    public readonly serviceAmount: number,
    public readonly featureImage: MediaResponse | null
  ) {}
}
