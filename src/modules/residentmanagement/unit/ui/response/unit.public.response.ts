import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { ResidenceResponse } from './residence.response';
import { UnitTypeResponse } from '../../../unit_type/ui/response/unit-type.response';
import { UnitServicesResponse } from './unit-services.response';

export class UnitPublicResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly surface: number,
    public readonly status: string,
    public readonly regularPrice: number,
    public readonly exclusivePrice: number,
    public readonly exclusiveOfferStartDate: Date,
    public readonly exclusiveOfferEndDate: Date,
    public readonly roomType: string,
    public readonly roomAmount: number,
    public readonly unitType: UnitTypeResponse,
    public readonly serviceType: string,
    public readonly serviceAmount: number,
    public readonly services: UnitServicesResponse[],
    public readonly gallery: MediaResponse[],
    public readonly featureImage: MediaResponse | null,
    public readonly residence: ResidenceResponse | null,
    public readonly about: string,
    public readonly bathrooms: string,
    public readonly bedroom: string,
    public readonly floor: string,
    public readonly transactionType: string,
    public readonly characteristics: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
