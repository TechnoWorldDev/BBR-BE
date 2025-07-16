import { Model } from 'objection';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { ResidenceStatusEnum } from '../../residence/domain/residence-status.enum';

export class Residence extends Model {
  id!: string;
  name!: string;
  status!: ResidenceStatusEnum
  developmentStatus!: DevelopmentStatusEnum;
  subtitle!: string;
  description!: string;
  budgetStartRange!: number;
  budgetEndRange!: number;
  address!: string;
  longitude!: string;
  latitude!: string;
  deletedAt?: Date;
  companyId?: string;

  static tableName = 'residences';
}
