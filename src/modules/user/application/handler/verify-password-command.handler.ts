import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class VerifyPasswordCommandHandler {
  constructor(private readonly userRepository: IUserRepository) {}

  async handle(id: string, password: string): Promise<void> {
    const user = await User.query().findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await User.verifyPassword(password, user.password);

    if (!result) {
      throw new BadRequestException('Current password is incorrect');
    }
  }
}
