import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IEmailVerificationRepository } from '../../domain/email-verification.repository.interface';
import { VerificationCommand } from '../command/verification.command';
import { User } from '../../domain/user.entity';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class VerifyEmailCommandHandler {
  constructor(
    private readonly repo: IEmailVerificationRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async handle(command: VerificationCommand): Promise<User> {
    const request = await this.repo.findByToken(command.token);

    if (!request || request.isVerified) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.repo.markAsVerified(request.id);

    await User.query()
      .patch({ emailVerified: true, status: UserStatusEnum.ACTIVE })
      .where({ id: request.userId });

    const user = await this.userRepository.findById(request.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
