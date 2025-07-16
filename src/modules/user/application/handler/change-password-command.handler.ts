import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../domain/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChangePasswordCommandHandler {
  constructor() {}

  async handle(id: string, currentPassword: string, newPassword: string) {
    const user = await User.query().findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await User.verifyPassword(currentPassword, user.password);

    if (!result) {
      throw new BadRequestException('Current password is incorrect');
    }

    await User.query().patch({ password: newPassword }).where({ id });
  }
}
