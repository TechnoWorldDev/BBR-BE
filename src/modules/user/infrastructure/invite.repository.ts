import { Injectable } from '@nestjs/common';
import { Invite } from '../domain/invite.entity';
import { IInviteRepository } from '../domain/invite.repository.interface';

@Injectable()
export class InviteRepositoryImpl implements IInviteRepository {
  async create(data: Partial<Invite>): Promise<Invite> {
    return await Invite.query().insert(data);
  }

  async findByToken(token: string): Promise<Invite | null> {
    return (await Invite.query().where({ token }).first()) ?? null;
  }

  async markAsAccepted(id: string): Promise<void> {
    await Invite.query().patch({ acceptedAt: new Date().toISOString() }).where({ id });
  }
}
