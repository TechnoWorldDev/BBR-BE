import { LeadStatusEnum } from '../../domain/lead-status.enum';

export class UpdateLeadStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: LeadStatusEnum
  ) {}
}
