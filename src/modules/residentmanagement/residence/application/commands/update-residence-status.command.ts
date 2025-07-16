import { ResidenceStatusEnum } from '../../domain/residence-status.enum';

export class UpdateResidenceStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: ResidenceStatusEnum
  ) {}
}
