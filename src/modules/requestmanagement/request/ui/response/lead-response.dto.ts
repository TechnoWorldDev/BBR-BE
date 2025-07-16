export class LeadResponse {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly status: string,
    public readonly phone: string | null,
    public readonly preferredContactMethod: string[] | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}