import { User } from './user.entity';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | undefined>;
}
