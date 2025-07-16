import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';

export class UpdatePositionRequestStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: ResidencePositionRequestStatusEnum
  ) {}
}
