import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendVerifyEmailCommandHandler as SendVerifyEmailMailCommandHandler } from 'src/modules/email/application/send-verify-email.command.handler';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { SendInviteEmailCommandHandler } from '../email/application/send-invite-email.command.handler';
import { IEmailRepository } from '../email/domain/email.repository.interface';
import { EmailRepository } from '../email/infrastructure/email.repository';
import { CreateUserCommandHandler } from './application/handler/create-user.command.handler';
import { DeleteUserCommandHandler } from './application/handler/delete-user.command.handler';
import { InviteUserCommandHandler } from './application/handler/invite-user-command.handler';
import { SendVerifyEmailCommandHandler } from './application/handler/send-verify-email.command.handler';
import { UpdateUserCommandHandler } from './application/handler/update-user-command.handler';
import { VerifyEmailCommandHandler } from './application/handler/verify-email.command.handler';
import { FetchUsersCommandHandler } from './application/query/fetch-users-command.query';
import { FindByIdUserCommandHandler } from './application/query/find-by-id-user.command.query';
import { IEmailVerificationRepository } from './domain/email-verification.repository.interface';
import { IInviteRepository } from './domain/invite.repository.interface';
import { IUserRepository } from './domain/user.repository.interface';
import { EmailVerificationRepositoryImpl } from './infrastructure/email-verification.repository';
import { InviteRepositoryImpl } from './infrastructure/invite.repository';
import { UserRepositoryImpl } from './infrastructure/user.repository';
import { UserController } from './ui/user.controller';
import EmailModule from '../email/email.module';
import { UpdateUserProfileCommandHandler } from './application/handler/update-user-profile.command.handler';
import { MediaModule } from '../media/media.module';
import { UpdateUserStatusCommandHandler } from './application/handler/update-user-status.command.handler';
import { UserMapper } from './ui/mappers/user.mapper';
import { FindByEmailUserQueryHandler } from './application/query/find-by-email-user.command.query';
import { VerifyPasswordCommandHandler } from './application/handler/verify-password-command.handler';
import { ChangePasswordCommandHandler } from './application/handler/change-password-command.handler';
import { IRoleRepository } from '../role/domain/role.repository.interface';
import { RoleRepositoryImpl } from '../role/infrastructure/role.repository';

@Module({
  imports: [DatabaseModule, EmailModule, MediaModule],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: IEmailVerificationRepository,
      useClass: EmailVerificationRepositoryImpl,
    },
    {
      provide: IEmailRepository,
      useClass: EmailRepository,
    },
    {
      provide: IInviteRepository,
      useClass: InviteRepositoryImpl,
    },
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    CreateUserCommandHandler,
    FetchUsersCommandHandler,
    FindByIdUserCommandHandler,
    DeleteUserCommandHandler,
    UpdateUserCommandHandler,
    SendVerifyEmailCommandHandler,
    SendVerifyEmailMailCommandHandler,
    SendInviteEmailCommandHandler,
    VerifyEmailCommandHandler,
    InviteUserCommandHandler,
    UpdateUserProfileCommandHandler,
    UpdateUserStatusCommandHandler,
    FindByEmailUserQueryHandler,
    VerifyPasswordCommandHandler,
    ChangePasswordCommandHandler,
    ConfigService,
    UserMapper,
  ],
  exports: [SendVerifyEmailCommandHandler],
})
export class UserModule {}
