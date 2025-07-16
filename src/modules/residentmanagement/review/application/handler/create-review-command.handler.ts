import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Review } from '../../domain/review.entity';
import { CreateReviewCommand } from '../command/create-review.command';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { IUserRepository } from '../../domain/user.repository.interface';
import { IUnitTypeRepository } from '../../domain/unit-type.repository.interface';
import { ReviewStatusEnum } from '../../domain/review-status.enum';
import { IReviewRepository } from '../../domain/ireview.repository.interface';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { ConfigService } from '@nestjs/config';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';

@Injectable()
export class CreateReviewCommandHandler {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly userRepository: IUserRepository,
    private readonly unitTypeRepository: IUnitTypeRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  async handle(command: CreateReviewCommand): Promise<Review> {
    const residence = await this.residenceRepository.findById(command.residenceId);
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const unitType = await this.unitTypeRepository.findById(command.unitTypeId);
    if (!unitType) {
      throw new NotFoundException('Unit type not found');
    }

    const reviewData: Partial<Review> = {
      residence: residence,
      user: user,
      dateOfPurchase: command.dateOfPurchase,
      unitType: unitType,
      isPrimaryResidence: command.isPrimaryResidence,
      verifiedOwnerOrTenant: command.verifiedOwnerOrTenant,
      buildQuality: command.buildQuality,
      purchaseExperienceRating: command.purchaseExperienceRating,
      amenities: command.amenities,
      neighbourhoodLocation: command.neighbourhoodLocation,
      valueForMoney: command.valueForMoney,
      serviceQuality: command.serviceQuality,
      additionalFeedback: command.additionalFeedback,
      status: ReviewStatusEnum.PENDING,
    };

    const created = await this.reviewRepository.create(reviewData);
    if (!created) {
      throw new InternalServerErrorException('Review not created');
    }

    await this.emailQueue.addEmailJob(EmailAction.SUBMIT_REVIEW, {
      to: user.email,
      variables: {
        fullName: `${user.fullName}`,
        residenceName: `${residence.name}`,
        exploreMoreResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/residences`,
      },
    });

    return created;
  }
}
