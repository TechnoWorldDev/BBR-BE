import { User } from './user.entity';

export abstract class IUserRepository {
  abstract findByCompanyId(companyId: string): Promise<User | undefined>;
}
