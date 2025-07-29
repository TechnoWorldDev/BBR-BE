import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { ResidencePositionRequest } from '../../domain/residence-position-requests.entity';
import { IResidencePositionRequestsRepository } from '../../domain/residence-position-requests.repository.interface';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { CreatePositionRequestCommand } from '../command/create-position-request.command';
import { ConfigService } from '@nestjs/config';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { IUserRepository } from '../../domain/user.repository.interface';
import { TwoTierSubscriptionService } from 'src/modules/billing/application/services/two-tier-subscription.service';

@Injectable()
export class CreatePositionRequestCommandHandler {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly rankingCategoryRepository: IRankingCategoryRepository,
    private readonly positionRequestRepository: IResidencePositionRequestsRepository,
    private readonly userRepository: IUserRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService,
    private readonly twoTierSubscriptionService: TwoTierSubscriptionService
  ) {}

  async handle(command: CreatePositionRequestCommand): Promise<ResidencePositionRequest> {
    const residence = await this.residenceRepository.findById(command.residenceId);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    const rankingCategory = await this.rankingCategoryRepository.findById(
      command.rankingCategoryId
    );

    if (!rankingCategory) {
      throw new NotFoundException('Ranking category not found');
    }

    const user = await this.userRepository.findById(command.requestedBy);

    if (!user) {
      throw new NotFoundException('Requested by user not found');
    }

    // Validate subscription requirements
    const subscriptionValidation = await this.twoTierSubscriptionService.validateRankingApplication(
      command.requestedBy,
      command.residenceId
    );

    if (!subscriptionValidation.canApply) {
      throw new BadRequestException(subscriptionValidation.reason);
    }

    // Check if user has active subscription for this specific ranking category
    const hasRankingSubscription = await this.twoTierSubscriptionService.hasActiveRankingSubscription(
      command.requestedBy,
      command.residenceId,
      command.rankingCategoryId
    );

    if (!hasRankingSubscription) {
      throw new BadRequestException(
        `You must have an active subscription for the "${rankingCategory.name}" ranking category before applying. Please subscribe to this ranking category first.`
      );
    }

    // Check if position request already exists for this combination
    const existingRequest = await this.positionRequestRepository.findByResidenceAndCategory(
      command.residenceId,
      command.rankingCategoryId,
      command.requestedBy
    );

    if (existingRequest) {
      throw new BadRequestException(
        'You have already applied for ranking in this category. Please wait for admin review.'
      );
    }

    const positionRequest = {
      residenceId: residence.id,
      rankingCategoryId: rankingCategory.id,
      requestedBy: command.requestedBy,
    };

    const created = await this.positionRequestRepository.create(positionRequest);

    if (!created) {
      throw new NotFoundException('Position request not created');
    }

    // send mail
    await this.emailQueue.addEmailJob(EmailAction.APPLY_FOR_RANKING, {
      to: user.email,
      variables: {
        fullName: `${user.fullName}`,
        residenceName: residence.name,
        categoryName: rankingCategory.name,
        exploreMoreOpportunitiesLink: `${this.configService.get<string>('FRONTEND_URL')}/careers`,
      },
    });

    return created;
  }
}
