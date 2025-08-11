import { VerificationTypeEnum } from '../../domain/verification-type.enum';

export class CreateResidenceVerificationCommand {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly password: string,
    public readonly verificationType: VerificationTypeEnum,
    public readonly agree: boolean,
    public readonly propertyId?: string,
    public readonly propertyName?: string,
    public readonly address?: string,
    public readonly cityId?: string,
    public readonly countryId?: string,
    public readonly planId?: string,
    public readonly notes?: string,
    public readonly meetingLink?: string,
    public readonly platform?: string,
    public readonly scheduledDate?: Date,
    public readonly scheduledTime?: string,
    public readonly preferredDate?: Date,
    public readonly preferredTime?: string,
    public readonly numberOfVisitors?: number,
    public readonly paymentMethodId?: string,
    public readonly paymentIntentId?: string,
  ) {}
}
