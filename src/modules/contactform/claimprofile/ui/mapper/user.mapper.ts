import { User } from 'src/modules/user/domain/user.entity';
import { UserResponse } from '../response/user.response';

export class UserMapper {
  static toResponse(user: User): UserResponse {
    return new UserResponse(user.id, user.fullName, user.email);
  }
}
