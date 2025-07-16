import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { UpdateResidenceStatusCommand } from '../commands/update-residence-status.command';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';
import { IUserRepository } from '../../domain/user.repository.interface';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UpdateResidenceStatusCommandHandler {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly emailQueue: EmailQueue,
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService
  ) {}

  async handle(command: UpdateResidenceStatusCommand): Promise<void> {
    const residence = await this.residenceRepository.findById(command.id);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    if (residence.status === command.status) {
      throw new ConflictException('Residence status is already the same');
    }

    const updated = await this.residenceRepository.update(command.id, {
      status: command.status,
    });

    if (!updated) {
      throw new InternalServerErrorException('Failed to update residence status');
    }

    if (residence.company) {
      const user = await this.userRepository.findByCompanyId(residence?.company?.id!);

      if (user) {
        if (command.status === ResidenceStatusEnum.ACTIVE) {
          await this.emailQueue.addEmailJob(EmailAction.ACCEPTED_RESIDENCE, {
            to: user.email,
            variables: {
              fullName: `${user.fullName}`,
              residenceName: `${residence.name}`,
              manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
            },
          });
        }

        if (command.status === ResidenceStatusEnum.REJECTED) {
          await this.emailQueue.addEmailJob(EmailAction.REJECTED_RESIDENCE, {
            to: user.email,
            variables: {
              fullName: `${user.fullName}`,
              residenceName: `${residence.name}`,
              manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
            },
          });
        }
      }
    }
  }
}
