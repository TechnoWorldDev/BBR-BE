import { PasswordResetRequest } from './password-reset-request.entity';

export abstract class IPasswordResetRequestRepository {
  abstract create(
    email: string,
    otp: string,
    resetToken: string,
    expiresAt: Date
  ): Promise<PasswordResetRequest>;
  abstract findByTokenAndOtp(token: string, otp: string): Promise<PasswordResetRequest | null>;
  abstract findByToken(token: string): Promise<PasswordResetRequest | null>;
  abstract markAsVerified(id: string): Promise<number>;
  abstract markAsUsed(id: string): Promise<number>;
}
