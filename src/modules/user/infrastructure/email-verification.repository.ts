import { Injectable } from '@nestjs/common';
import { IEmailVerificationRepository } from '../domain/email-verification.repository.interface';
import { EmailVerificationRequest } from '../domain/email-verification-request.model';

@Injectable()
export class EmailVerificationRepositoryImpl implements IEmailVerificationRepository {
  async create(data: { userId: string; token: string; expiresAt: string }) {
    await EmailVerificationRequest.query().insert(data);
  }

  async findByToken(token: string) {
    return (
      (await EmailVerificationRequest.query()
        .where({ token })
        .andWhere('expiresAt', '>', new Date().toISOString())
        .first()) ?? null
    );
  }

  async markAsVerified(id: string) {
    await EmailVerificationRequest.query()
      .patch({ isVerified: true, verifiedAt: new Date().toISOString() })
      .where({ id });
  }

  async findByUserId(userId: string) {
    return (
      (await EmailVerificationRequest.query()
        .where({ userId })
        .andWhere('expiresAt', '>', new Date().toISOString())
        .first()) ?? null
    );
  }
}
