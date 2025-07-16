import { LeadResponse } from './lead-response.dto';

export class RequestResponse {
  constructor(
    public readonly id: string,
    public readonly subject: string | null,
    public readonly message: string,
    public readonly entityId: string,
    public readonly type: string,
    public readonly status: string,
    public readonly note: string,
    public readonly lead: LeadResponse,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
