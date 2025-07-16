import { Model } from 'objection';

export class Invite extends Model {
  static tableName = 'invites';

  id!: string;
  email!: string;
  token!: string;
  role?: string;
  expiresAt!: string;
  acceptedAt?: string;
  createdBy?: string;
  createdAt!: string;

  static get idColumn() {
    return 'id';
  }
}
