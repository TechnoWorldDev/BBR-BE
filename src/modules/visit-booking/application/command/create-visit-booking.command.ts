import { VisitTypeEnum } from '../../domain/visit-type.enum';

export class CreateVisitBookingCommand {
  constructor(
    public readonly propertyName: string,
    public readonly countryId: string,
    public readonly cityId: string,
    public readonly address: string,
    public readonly planId: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly password: string,
    public readonly stripePaymentMethodId: string,
    public readonly agree: boolean,
    public readonly propertyId?: string,
    public readonly scheduledDate?: string,
    public readonly scheduledTime?: string,
    public readonly duration?: number,
    public readonly specialRequirements?: string,
    public readonly notes?: string,
    public readonly numberOfVisitors?: number,
  ) {}
}
