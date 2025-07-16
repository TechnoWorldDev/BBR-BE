import { Invite } from './invite.entity';

export abstract class IInviteRepository {
  abstract create(data: Partial<Invite>): Promise<Invite>;
  abstract findByToken(token: string): Promise<Invite | null>;
  abstract markAsAccepted(id: string): Promise<void>;
}
