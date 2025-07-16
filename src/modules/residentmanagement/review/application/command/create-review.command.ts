import { ReviewStatusEnum } from '../../domain/review-status.enum';

export class CreateReviewCommand {
  constructor(
    public readonly residenceId: string,
    public readonly userId: string,
    public readonly dateOfPurchase: Date,
    public readonly unitTypeId: string,
    public readonly isPrimaryResidence: boolean,
    public readonly verifiedOwnerOrTenant: boolean,

    public readonly buildQuality: number,
    public readonly purchaseExperienceRating: number,
    public readonly amenities: number,
    public readonly neighbourhoodLocation: number,
    public readonly valueForMoney: number,
    public readonly serviceQuality: number,

    public readonly additionalFeedback: string | null,
  ) {}
}
