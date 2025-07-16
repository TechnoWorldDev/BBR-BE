import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateUserPreferences {
  constructor() {}

  @LogMethod()
  async handler(userId: string, updateData: any) {}
}
