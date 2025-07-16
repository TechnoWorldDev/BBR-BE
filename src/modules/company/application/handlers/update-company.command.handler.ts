import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from 'src/modules/company/domain/company.entity';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { UpdateCompanyCommand } from '../commands/update-company.command';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';

@Injectable()
export class UpdateCompanyCommandHandler {
  constructor(
    private readonly companyRepository: ICompanyRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  @LogMethod()
  async handle(command: UpdateCompanyCommand): Promise<Company> {
    const company = await this.companyRepository.findById(command.id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (command.imageId) {
      const image = await this.mediaRepository.findById(command.imageId);

      if (!image) {
        throw new NotFoundException('Image not found');
      }
    }

    if (command.contactPersonAvatarId) {
      const contactPersonAvatar = await this.mediaRepository.findById(
        command.contactPersonAvatarId
      );

      if (!contactPersonAvatar) {
        throw new NotFoundException('Contact person avatar not found');
      }
    }

    return await this.companyRepository.update(command.id, command);
  }
}
