import { Model } from 'objection';

export class PasswordResetRequest extends Model {
  static tableName = 'password_reset_requests';

  id!: string;
  email!: string;
  otp!: string;
  resetToken!: string;
  isVerified!: boolean;
  expiresAt!: Date;
  verifiedAt?: Date;
  usedAt?: Date;
  createdAt!: Date;

  static get idColumn() {
    return 'id';
  }
}
