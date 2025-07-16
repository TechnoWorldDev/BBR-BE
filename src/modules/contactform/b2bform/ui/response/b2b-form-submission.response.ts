export class B2BFormSubmissionResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly phoneNumber: string,
    public readonly email: string,
    public readonly companyName: string | null,
    public readonly brandedResidencesName: string | null,
    public readonly companyWebsite: string | null,
    public readonly pageOrigin: string,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
