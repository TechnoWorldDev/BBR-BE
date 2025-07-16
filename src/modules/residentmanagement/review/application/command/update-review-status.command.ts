import { ReviewStatusEnum } from '../../domain/review-status.enum';
import { User } from '../../../../user/domain/user.entity';

export class UpdateReviewStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: ReviewStatusEnum
  ) {}
}
