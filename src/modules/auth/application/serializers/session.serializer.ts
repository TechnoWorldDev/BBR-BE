import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserRepositoryImpl } from 'src/modules/user/infrastructure/user.repository';
import { UserMapper } from 'src/modules/user/ui/mappers/user.mapper';
import { IAuthRepository } from '../../domain/auth.repository.interface';
import { IUserRepository } from 'src/modules/user/domain/user.repository.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly userMapper: UserMapper
  ) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, { id: user.id, email: user.email, status: user.status });
  }

  async deserializeUser(payload: any, done: Function) {
    try {
      // const user = await this.userRepository.findById(payload.id);
      const user = await this.authRepository.findByEmail(payload.email);

      if (!user) {
        return done(null, false);
      }

      done(null, this.userMapper.toResponse(user));
    } catch (error) {
      done(error, false);
    }
  }
}
