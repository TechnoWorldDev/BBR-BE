import { BadRequestException, Injectable } from '@nestjs/common';
import { VerifyResetOtpCommand } from '../commands/verify-reset-otp.command';
import { IPasswordResetRequestRepository } from '../../domain/password-reset-request.repository.interface';

@Injectable()
export class VerifyResetOtpCommandHandler {
  constructor(private readonly passwordResetRequestRepository: IPasswordResetRequestRepository) {}

  async handle(command: VerifyResetOtpCommand) {
    const request = await this.passwordResetRequestRepository.findByTokenAndOtp(
      command.resetToken,
      command.otp
    );

    if (!request || request.expiresAt < new Date() || request.isVerified)
      throw new BadRequestException('Invalid or expired OTP');

    await this.passwordResetRequestRepository.markAsVerified(request.id);
  }
}
