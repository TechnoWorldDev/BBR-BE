import { EmailVerificationRequest } from './email-verification-request.model';

export abstract class IEmailVerificationRepository {
  abstract create(data: { userId: string; token: string; expiresAt: string }): Promise<void>;
  abstract findByUserId(userId: string): Promise<EmailVerificationRequest | null>;
  abstract findByToken(token: string): Promise<EmailVerificationRequest | null>;
  abstract markAsVerified(id: string): Promise<void>;
}
