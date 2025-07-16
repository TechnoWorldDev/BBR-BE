import { RequestStatusEnum } from '../../domain/request-status.enum';

export class UpdateRequestCommand {
  constructor(
    public readonly id: string,
    public readonly note: string,
    public readonly status: RequestStatusEnum,
  ) {}
}
