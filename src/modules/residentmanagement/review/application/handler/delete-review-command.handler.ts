import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IReviewRepository } from '../../domain/ireview.repository.interface';
import { User } from '../../../../user/domain/user.entity';

@Injectable()
export class DeleteReviewCommandHandler {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepository.softDelete(id);
  }
}
