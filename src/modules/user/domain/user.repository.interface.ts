import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchUsersQuery } from '../application/command/fetch-users.query';
import { UpdateUserProfileRequest } from '../ui/request/update-user-profile.request';
import { User } from './user.entity';

export abstract class IUserRepository {
  abstract create(user: Partial<User>): Promise<User | undefined>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByCompanyId(companyId: string): Promise<User | null>;
  abstract findAll(
    fetchQuery: FetchUsersQuery
  ): Promise<{ data: User[]; pagination: PaginationResponse }>;
  abstract update(id: string, user: Partial<User>): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract updateProfile(userId: string, updateData: UpdateUserProfileRequest): Promise<User>;
}
