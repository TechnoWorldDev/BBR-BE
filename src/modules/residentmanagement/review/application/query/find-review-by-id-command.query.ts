import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from '../../domain/review.entity';
import { IReviewRepository } from '../../domain/ireview.repository.interface';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class FindReviewByIdCommandQuery {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async handle(user: User, id: string): Promise<Review> {
    const review = await this.reviewRepository.findById(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.REVIEWS_UPDATE_OWN);

    if (hasOwnPermission) {
      const reviewOwn = await this.reviewRepository.findOwnById(user?.company?.id!, id);

      if (!reviewOwn) {
        throw new NotFoundException('Review not found');
      }

      return reviewOwn;
    }

    return review;
  }
}
