import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMMSessionCommand } from '../command/create-mm-sesssion.command';
import { IMatchmakingSessionsRepository } from '../../domain/matchmaking-sessions.repository.interface';

@Injectable()
export class CreateMMSessionCommandHandler {
  constructor(private readonly matchmakingSessionsRepository: IMatchmakingSessionsRepository) {}

  async handle(command: CreateMMSessionCommand) {
    const newSession = {
      userId: command.userId,
      metadata: command.metadata,
    };

    const session = await this.matchmakingSessionsRepository.create(newSession);

    if (!session) throw new InternalServerErrorException('Matchmaking session not created');

    return session;
  }
}
