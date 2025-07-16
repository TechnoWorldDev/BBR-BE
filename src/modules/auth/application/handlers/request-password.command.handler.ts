import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthRepository } from 'src/modules/auth/domain/auth.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { RequestResetPasswordCommand } from '../commands/request-reset-password.command';
import { IPasswordResetRequestRepository } from '../../domain/password-reset-request.repository.interface';
import { User } from 'src/modules/user/domain/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { generateSecureOtp } from 'src/shared/utils/generate-secure-otp.util';
import { SendResetPasswordEmailCommand } from 'src/modules/email/application/command/send-reset-password-email.command';
import { SendResetPasswordEmailCommandHandler } from 'src/modules/email/application/send-reset-password-email.command.handler';

@Injectable()
export class RequestPasswordCommandHandler {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly passwordResetRequestRepository: IPasswordResetRequestRepository,
    private readonly sendResetPasswordEmailHandler: SendResetPasswordEmailCommandHandler
  ) {}

  @LogMethod()
  async handle(command: RequestResetPasswordCommand) {
    const user = await User.query().findOne({ email: command.email });
    if (!user) {
      throw new BadRequestException();
    }

    const otp = generateSecureOtp(); // npr. 6-cifren random
    const resetToken = uuidv4(); // ili jwt ako želiš
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.passwordResetRequestRepository.create(command.email, otp, resetToken, expiresAt);

    await this.sendResetPasswordEmailHandler.handle(
      new SendResetPasswordEmailCommand(command.email, otp)
    );

    return { resetToken };
  }
}
