import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompanyProfileCommand } from '../commands/update-company-profile.command';
import { ICompanyRepository } from '../../domain/company.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';

@Injectable()
export class UpdateCompanyProfileCommandHandler {
  constructor(
    private readonly companyRepository: ICompanyRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  async handle(command: UpdateCompanyProfileCommand) {
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
