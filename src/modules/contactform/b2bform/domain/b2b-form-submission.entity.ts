import { Model, RelationMappings } from 'objection';
import { B2BFormSubmissionStatus } from './b2b-form-submission-status.enum';

export class B2BFormSubmission extends Model {
  id!: string;
  name!: string;
  phoneNumber!: string;
  email!: string;
  companyName!: string | null;
  brandedResidencesName!: string | null;
  companyWebsite!: string | null;
  pageOrigin!: string;
  status!: B2BFormSubmissionStatus;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'b2b_form_submissions';

  static relationMappings: RelationMappings = {};

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
