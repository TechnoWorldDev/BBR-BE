import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IPhoneCodeRepository } from '../../domain/phone-code.repository.interface';
import { PhoneCode } from '../../domain/phone-code.entity';

@Injectable()
export class FindPhoneCodeByIdCommandQuery {
  constructor(private readonly phoneCodeRepository: IPhoneCodeRepository) {}

  @LogMethod()
  async handle(id: string): Promise<PhoneCode> {
    const phoneCode = await this.phoneCodeRepository.findById(id);
    if (!phoneCode) throw new NotFoundException('Phone code not found');
    return phoneCode;
  }
}
