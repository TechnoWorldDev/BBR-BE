import { UnitStatusEnum } from '../../domain/unit-status.enum';

export class UpdateUnitStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: UnitStatusEnum
  ) {}
}
