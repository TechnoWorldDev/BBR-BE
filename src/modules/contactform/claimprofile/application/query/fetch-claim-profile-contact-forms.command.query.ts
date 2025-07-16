import { ForbiddenException, Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { ClaimProfileContactForm } from '../../domain/claim-profile-contact-form.entity';
import { FetchClaimProfileContactFormsQuery } from '../command/fetch-claim-profile-contact-forms.query';
import { IClaimProfileContactFormRepository } from '../../domain/claim-profile-contact-form.repository';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class FetchClaimProfileContactFormsCommandQuery {
  constructor(
    private readonly claimProfileContactFormRepository: IClaimProfileContactFormRepository
  ) {}

  @LogMethod()
  async handle(
    user: User,
    query: FetchClaimProfileContactFormsQuery
  ): Promise<{ data: ClaimProfileContactForm[]; pagination: PaginationResponse }> {
    const hasOwnPermission = user.role.permissions?.includes(
      PermissionsEnum.CLAIM_PROFILE_CONTACT_FORMS_READ_OWN
    );

    if (hasOwnPermission && query.createdBy && user.id !== query.createdBy) {
      throw new ForbiddenException(
        'You do not have permission to view claim profile contact forms.'
      );
    }

    if (hasOwnPermission) {
      query.createdBy = user.id;
    }

    const result = await this.claimProfileContactFormRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
