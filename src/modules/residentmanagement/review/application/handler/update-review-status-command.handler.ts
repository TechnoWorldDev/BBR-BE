import {
  Injectable,
  NotFoundException,
  InternalServerErrorException, ForbiddenException,
} from '@nestjs/common';
import { Review } from '../../domain/review.entity';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { UpdateReviewStatusCommand } from '../command/update-review-status.command';
import { IReviewRepository } from '../../domain/ireview.repository.interface';

@Injectable()
export class UpdateReviewStatusCommandHandler {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  @LogMethod()
  async handle(command: UpdateReviewStatusCommand): Promise<Review> {
    const existingReview = await this.reviewRepository.findById(command.id);
    if (!existingReview) {
      throw new NotFoundException('Review not found');
    }

    const updatedReviewData: Partial<Review> = {
      status: command.status,
    };

    const updatedReview = await this.reviewRepository.update(command.id, updatedReviewData);
    if (!updatedReview) {
      throw new InternalServerErrorException('Review status could not be updated');
    }

    return updatedReview;
  }
}
