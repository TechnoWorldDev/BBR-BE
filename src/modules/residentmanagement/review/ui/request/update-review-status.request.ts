import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ReviewStatusEnum } from '../../domain/review-status.enum';

export class UpdateReviewStatusRequest {
  @IsNotEmpty()
  @IsEnum(ReviewStatusEnum)
  status: ReviewStatusEnum;
}
