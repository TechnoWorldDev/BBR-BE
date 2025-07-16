import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPasswordResetRequestRepository } from '../../domain/password-reset-request.repository.interface';
import { ResetPasswordCommand } from '../commands/reset-password.command';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class ResetPasswordCOmmandHandler {
  constructor(private readonly passwordResetRequestRepository: IPasswordResetRequestRepository) {}

  async handle(command: ResetPasswordCommand) {
    const { resetToken, newPassword } = command;

    const request = await this.passwordResetRequestRepository.findByToken(resetToken);

    if (!request || !request.isVerified || request.usedAt) {
      throw new BadRequestException('Invalid or expired reset request');
    }

    const user = await User.query().findOne({ email: request.email });
    if (!user) throw new NotFoundException();

    // * Update the user's password trigger hook
    user.password = newPassword;
    await user.$query().patch();

    await this.passwordResetRequestRepository.markAsUsed(request.id);
  }
}
