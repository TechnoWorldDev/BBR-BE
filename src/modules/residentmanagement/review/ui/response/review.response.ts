import { ReviewStatusEnum } from '../../domain/review-status.enum';
import { ResidenceResponse } from './residence.response';
import { UserResponse } from './user.response';
import { UnitTypeResponse } from './unit-type.response';

export class ReviewResponse {
  constructor(
    public readonly id: string,
    public readonly residence: ResidenceResponse,
    public readonly user: UserResponse,
    public readonly dateOfPurchase: Date,
    public readonly unitType: UnitTypeResponse,
    public readonly isPrimaryResidence: boolean,
    public readonly verifiedOwnerOrTenant: boolean,
    public readonly buildQuality: number,
    public readonly purchaseExperienceRating: number,
    public readonly amenities: number,
    public readonly neighbourhoodLocation: number,
    public readonly valueForMoney: number,
    public readonly serviceQuality: number,
    public readonly additionalFeedback: string | null,
    public readonly status: ReviewStatusEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date
  ) {}
}
