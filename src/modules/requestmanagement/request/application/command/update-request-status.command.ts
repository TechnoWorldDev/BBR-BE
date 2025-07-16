import { RequestStatusEnum } from '../../domain/request-status.enum';

export class UpdateRequestStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: RequestStatusEnum,
  ) {}
}
