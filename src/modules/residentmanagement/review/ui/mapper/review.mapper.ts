import { CreateReviewRequest } from '../request/create-review.request';
import { CreateReviewCommand } from '../../application/command/create-review.command';
import { ReviewResponse } from '../response/review.response';
import { Review } from '../../domain/review.entity';
import { ResidenceResponse } from '../response/residence.response';
import { UserResponse } from '../response/user.response';
import { UnitTypeResponse } from '../response/unit-type.response';

export class ReviewMapper {
  static toCreateCommand(userId:string, request: CreateReviewRequest): CreateReviewCommand {
    return new CreateReviewCommand(
      request.residenceId,
  userId,
      request.dateOfPurchase,
      request.unitTypeId,
      request.isPrimaryResidence,
      request.verifiedOwnerOrTenant,
      request.buildQuality,
      request.purchaseExperienceRating,
      request.amenities,
      request.neighbourhoodLocation,
      request.valueForMoney,
      request.serviceQuality,
      request.additionalFeedback,
    );
  }

  static toResponse(review: Review): ReviewResponse {
    return new ReviewResponse(
      review.id,
      new ResidenceResponse(
        review.residence.id,
        review.residence.name,
        review.residence.status,
        review.residence.developmentStatus,
        review.residence.subtitle,
        review.residence.description,
        review.residence.budgetStartRange,
        review.residence.budgetEndRange,
        review.residence.address,
        review.residence.longitude,
        review.residence.latitude,
      ),
      new UserResponse(
        review.user.id,
        review.user.fullName,
        review.user.email
      ),
      review.dateOfPurchase,
      new UnitTypeResponse(
        review.unitType.id,
        review.unitType.name,
        review.unitType.createdAt,
        review.unitType.updatedAt
      ),
      review.isPrimaryResidence,
      review.verifiedOwnerOrTenant,
      review.buildQuality,
      review.purchaseExperienceRating,
      review.amenities,
      review.neighbourhoodLocation,
      review.valueForMoney,
      review.serviceQuality,
      review.additionalFeedback,
      review.status,
      review.createdAt,
      review.updatedAt,
      review.deletedAt
    );
  }
}
