import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.interface';
import { UpdateUserProfileRequest } from '../../ui/request/update-user-profile.request';
import { UpdateUserProfileCommand } from '../command/update-user-profile.command';

@Injectable()
export class UpdateUserProfileCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(command: UpdateUserProfileCommand) {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: UpdateUserProfileRequest = {
      fullName: command.fullName,
      phoneNumber: command.phoneNumber,
      phoneNumberCountryCode: command.phoneNumberCountryCode,
      imageId: command.imageId,
      currentLocation: command.currentLocation,
      preferredContactMethod: command.preferredContactMethod,
      preferredResidenceLocation: command.preferredResidenceLocation,
      budgetRangeFrom: command.budgetRangeFrom,
      budgetRangeTo: command.budgetRangeTo,
      unitTypes: command.unitTypes,
      lifestyles: command.lifestyles,
      receiveLuxuryInsights: command.receiveLuxuryInsights,
      notifyLatestNews: command.notifyLatestNews,
      notifyBlogs: command.notifyBlogs,
      notifyMarketTrends: command.notifyMarketTrends,
      pushNotifications: command.pushNotifications,
      emailNotifications: command.emailNotifications,
    };

    return await this.userRepository.updateProfile(command.userId, updateData);
  }
}
