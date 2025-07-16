import { Injectable } from '@nestjs/common';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../shared/utils/pagination.util';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IPhoneCodeRepository } from '../domain/phone-code.repository.interface';
import { PhoneCode } from '../domain/phone-code.entity';
import { FetchPhoneCodesQuery } from '../application/command/fetch-phone-codes.query';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';

@Injectable()
export class PhoneCodeRepositoryImpl implements IPhoneCodeRepository {
  @LogMethod()
  async create(phoneCode: Partial<PhoneCode>): Promise<PhoneCode> {
    return PhoneCode.create(phoneCode);
  }

  @LogMethod()
  async findById(id: string): Promise<PhoneCode | undefined> {
    return PhoneCode.query().findById(id).withGraphFetched('country').whereNull('deleted_at');
  }

  @LogMethod()
  async findByCode(code: string): Promise<PhoneCode | undefined> {
    return PhoneCode.query().findOne({ code }).whereNull('deleted_at');
  }

  async createOrUpdatePhoneCodesForCountry(
    codes: string[],
    countryId: string
  ): Promise<PhoneCode[]> {
    const phoneCodes = await PhoneCode.query()
      .whereIn('code', codes)
      .where('countryId', countryId)
      .whereNull('deleted_at');

    const missingCodes = codes.filter((code) => !phoneCodes.some((pc) => pc.code === code));

    const updatedPhoneCodes = await Promise.all(
      phoneCodes.map(async (pc) => {
        if (pc.countryId !== countryId) {
          return PhoneCode.query().patchAndFetchById(pc.id, { countryId });
        }
        return pc;
      })
    );

    if (missingCodes.length > 0) {
      const newPhoneCodes = await PhoneCode.query().insertGraph(
        missingCodes.map((code) => ({
          code,
          countryId,
        }))
      );

      return [...updatedPhoneCodes, ...newPhoneCodes];
    }

    const codesArray = Array.from(codes);
    const phoneCodesToDelete = await PhoneCode.query()
      .where('countryId', countryId)
      .whereNotIn('code', codesArray)
      .whereNull('deleted_at');

    await Promise.all(
      phoneCodesToDelete.map((pc) => PhoneCode.query().delete().where({ id: pc.id }))
    );

    return updatedPhoneCodes;
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchPhoneCodesQuery
  ): Promise<{ data: PhoneCode[]; pagination: PaginationResponse }> {
    const { page, limit, searchQuery } = fetchQuery;

    let query = PhoneCode.query()
      .joinRelated('country')
      .whereNull('phone_codes.deleted_at')
      .withGraphFetched('country');

    const columnsToSearch = ['phone_codes.code', 'country.name'];

    query = applySearchFilter(query.clone(), searchQuery, columnsToSearch);

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(query, page, limit);

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page: page,
        limit: limit,
      },
    };
  }

  @LogMethod()
  async findByCountryId(countryId: string): Promise<PhoneCode[]> {
    return PhoneCode.query().where('countryId', countryId);
  }

  @LogMethod()
  async update(id: string, data: Partial<PhoneCode>): Promise<PhoneCode | undefined> {
    return PhoneCode.query().patchAndFetchById(id, data);
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    await PhoneCode.query().deleteById(id);
  }
}
