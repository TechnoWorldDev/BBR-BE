import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchPhoneCodesQuery } from '../application/command/fetch-phone-codes.query';
import { PhoneCode } from './phone-code.entity';

export abstract class IPhoneCodeRepository {
  abstract create(phoneCode: Partial<PhoneCode>): Promise<PhoneCode>;
  abstract findById(id: string): Promise<PhoneCode | undefined>;
  abstract findByCode(code: string): Promise<PhoneCode | undefined>;
  abstract createOrUpdatePhoneCodesForCountry(
    codes: string[],
    countryId: string
  ): Promise<PhoneCode[]>;
  abstract findAll(
    query: FetchPhoneCodesQuery
  ): Promise<{ data: PhoneCode[]; pagination: PaginationResponse }>;
  abstract findByCountryId(countryId: string): Promise<PhoneCode[]>;
  abstract update(id: string, data: Partial<PhoneCode>): Promise<PhoneCode | undefined>;
  abstract delete(id: string): Promise<void>;
}
