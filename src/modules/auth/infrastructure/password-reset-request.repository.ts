import { Injectable } from '@nestjs/common';
import { RequestResetPasswordCommand } from '../application/commands/request-reset-password.command';
import { IPasswordResetRequestRepository } from '../domain/password-reset-request.repository.interface';
import { PasswordResetRequest } from '../domain/password-reset-request.entity';

@Injectable()
export class passwordResetRequestRepository implements IPasswordResetRequestRepository {
  async create(
    email: string,
    otp: string,
    resetToken: string,
    expiresAt: Date
  ): Promise<PasswordResetRequest> {
    const data = {
      email,
      otp,
      resetToken,
      expiresAt,
    };

    return await PasswordResetRequest.query().insert(data);
  }

  async findByTokenAndOtp(token: string, otp: string): Promise<PasswordResetRequest | null> {
    return (
      (await PasswordResetRequest.query()
        .where({ resetToken: token, otp })
        .andWhere('expiresAt', '>', new Date())
        .first()) ?? null
    );
  }

  async findByToken(token: string): Promise<PasswordResetRequest | null> {
    return (await PasswordResetRequest.query().where({ resetToken: token }).first()) ?? null;
  }

  async markAsVerified(id: string): Promise<number> {
    return await PasswordResetRequest.query()
      .patch({ isVerified: true, verifiedAt: new Date() })
      .where({ id });
  }

  async markAsUsed(id: string): Promise<number> {
    return await PasswordResetRequest.query().patch({ usedAt: new Date() }).where({ id });
  }
}
