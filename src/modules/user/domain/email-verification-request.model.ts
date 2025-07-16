import { Model } from 'objection';

export class EmailVerificationRequest extends Model {
  static tableName = 'email_verification_requests';

  id!: string;
  userId!: string;
  token!: string;
  isVerified!: boolean;
  expiresAt!: string;
  verifiedAt?: string;
  createdAt!: string;

  static get idColumn() {
    return 'id';
  }
}
