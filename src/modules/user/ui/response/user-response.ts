import { Expose, Type } from 'class-transformer';
import { CompanyResponse } from './company.response';
import { RoleResponse } from './role.response';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { UserBuyer } from '../../domain/user-buyer.entity';

export class UserResponse {
  @Expose()
  readonly id: string;

  @Expose()
  readonly fullName: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly receiveLuxuryInsights?: boolean;

  @Expose()
  readonly notifyLatestNews?: boolean;

  @Expose()
  readonly notifyMarketTrends?: boolean;

  @Expose()
  readonly notifyBlogs?: boolean;

  @Expose()
  readonly pushNotifications?: boolean;

  @Expose()
  readonly emailNotifications?: boolean;

  @Expose()
  readonly signupMethod?: string;

  @Expose()
  readonly emailVerified?: boolean;

  @Expose()
  readonly agreedTerms?: boolean;

  @Expose()
  readonly status?: UserStatusEnum;

  @Expose()
  readonly buyer?: UserBuyer | null;

  @Expose()
  @Type(() => CompanyResponse)
  readonly company?: CompanyResponse | null;

  @Expose()
  @Type(() => RoleResponse)
  readonly role?: RoleResponse;

  @Expose()
  readonly createdAt?: Date;

  @Expose()
  readonly updatedAt?: Date;

  @Expose()
  readonly deletedAt?: Date;

  constructor(
    id: string,
    fullName: string,
    email: string,
    receiveLuxuryInsights?: boolean,
    notifyLatestNews?: boolean,
    notifyMarketTrends?: boolean,
    notifyBlogs?: boolean,
    pushNotifications?: boolean,
    emailNotifications?: boolean,
    signupMethod?: string,
    emailVerified?: boolean,
    agreedTerms?: boolean,
    status?: UserStatusEnum,
    buyer?: UserBuyer | null,
    company?: CompanyResponse | null,
    role?: RoleResponse,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.receiveLuxuryInsights = receiveLuxuryInsights;
    this.notifyLatestNews = notifyLatestNews;
    this.notifyMarketTrends = notifyMarketTrends;
    this.notifyBlogs = notifyBlogs;
    this.pushNotifications = pushNotifications;
    this.emailNotifications = emailNotifications;
    this.signupMethod = signupMethod;
    this.emailVerified = emailVerified;
    this.agreedTerms = agreedTerms;
    this.status = status;
    this.buyer = buyer;
    this.company = company;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
