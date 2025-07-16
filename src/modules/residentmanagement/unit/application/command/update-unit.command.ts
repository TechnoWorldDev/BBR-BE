import { UnitStatusEnum } from '../../domain/unit-status.enum';
import { UnitTransactionTypeEnum } from '../../domain/unit-transaction-type.enum';
import { UnitServicesRequest } from '../../ui/request/unit-services.request';

export class UpdateUnitCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly surface: number,
    public readonly status: UnitStatusEnum,
    public readonly regularPrice: number,
    public readonly exclusivePrice: number,
    public readonly exclusiveOfferStartDate: Date,
    public readonly exclusiveOfferEndDate: Date,
    public readonly roomType: string,
    public readonly roomAmount: number,
    public readonly unitTypeId: string,
    public readonly services: UnitServicesRequest[],
    public readonly featureImageId: string,
    public readonly residenceId: string,
    public readonly galleryMediaIds: string[],
    public readonly about: string,
    public readonly bathrooms: string,
    public readonly bedroom: string,
    public readonly floor: string,
    public readonly transactionType: UnitTransactionTypeEnum,
    public readonly characteristics: string[]
  ) {}
}
