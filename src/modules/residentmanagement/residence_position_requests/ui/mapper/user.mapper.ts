import { User } from '../../domain/user.entity';
import { UserResponse } from '../response/user.response';

export class UserMapper {
  static toResponse(user: User): UserResponse {
    const usr = new UserResponse(user.id, user.fullName, user.email, user.company);
    return usr;
  }
}
