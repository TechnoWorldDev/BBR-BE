import { Role } from 'src/modules/role/domain/role.entity';
import { User } from 'src/modules/user/domain/user.entity';

export abstract class IAuthRepository {
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract create(userData: Partial<User>): Promise<User | undefined>;
  abstract saveResetToken(userId: string, resetToken: string): Promise<User>;
  abstract findRoleByName(name: string): Promise<Role | undefined>;
}
