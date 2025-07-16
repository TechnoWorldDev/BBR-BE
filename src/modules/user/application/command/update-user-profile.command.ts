export class UpdateUserProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly fullName?: string,
    public readonly phoneNumber?: string,
    public readonly phoneNumberCountryCode?: string,
    public readonly imageId?: string,
    public readonly currentLocation?: string,
    public readonly preferredContactMethod?: string,
    public readonly preferredResidenceLocation?: string,
    public readonly budgetRangeFrom?: number,
    public readonly budgetRangeTo?: number,
    public readonly unitTypes?: string[],
    public readonly lifestyles?: string[],
    public readonly receiveLuxuryInsights?: boolean,
    public readonly notifyLatestNews?: boolean,
    public readonly notifyBlogs?: boolean,
    public readonly notifyMarketTrends?: boolean,
    public readonly pushNotifications?: boolean,
    public readonly emailNotifications?: boolean
  ) {}
}
