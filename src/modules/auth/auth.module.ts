import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { SendResetPasswordEmailCommandHandler } from '../email/application/send-reset-password-email.command.handler';
import { IEmailRepository } from '../email/domain/email.repository.interface';
import { EmailRepository } from '../email/infrastructure/email.repository';
import { UserRepositoryImpl } from '../user/infrastructure/user.repository';
import { UserModule } from '../user/user.module';
import { RequestPasswordCommandHandler } from './application/handlers/request-password.command.handler';
import { ResetPasswordCOmmandHandler } from './application/handlers/reset-password.command.handler';
import { SignInCommandHandler } from './application/handlers/sign-in.command.handler';
import { SignUpBuyerCommandHandler } from './application/handlers/sign-up-buyer.command.handler';
import { SignUpDeveloperCommandHandler } from './application/handlers/sign-up-developer.command.handler';
import { SignUpGoogleCommandHandler } from './application/handlers/sign-up-google.command.handler';
import { ValidateUserCommandHandler } from './application/handlers/validate-user.command.handler';
import { VerifyResetOtpCommandHandler } from './application/handlers/verify-reset-otp.command.handler';
import { FindByEmailQueryHandler } from './application/query/find-by-email.command.query';
import { SessionSerializer } from './application/serializers/session.serializer';
import { GoogleStrategy } from './application/strategies/google.strategy';
import { LocalStrategy } from './application/strategies/local.strategy';
import { IAuthRepository } from './domain/auth.repository.interface';
import { IPasswordResetRequestRepository } from './domain/password-reset-request.repository.interface';
import { AuthRepository } from './infrastructure/auth.repository';
import { passwordResetRequestRepository } from './infrastructure/password-reset-request.repository';
import { AuthController } from './ui/auth.controller';
import { IInviteRepository } from '../user/domain/invite.repository.interface';
import { InviteRepositoryImpl } from '../user/infrastructure/invite.repository';
import { AcceptInviteCommandHandler } from './application/handlers/accept-invite.command.handler';
import { IUserRepository } from '../user/domain/user.repository.interface';
import { UserMapper } from '../user/ui/mappers/user.mapper';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    {
      provide: IPasswordResetRequestRepository,
      useClass: passwordResetRequestRepository,
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
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    LocalStrategy,
    SessionSerializer,
    GoogleStrategy,
    UserRepositoryImpl,
    FindByEmailQueryHandler,
    SignInCommandHandler,
    SignUpBuyerCommandHandler,
    SignUpDeveloperCommandHandler,
    SignUpGoogleCommandHandler,
    ValidateUserCommandHandler,
    RequestPasswordCommandHandler,
    ResetPasswordCOmmandHandler,
    VerifyResetOtpCommandHandler,
    SendResetPasswordEmailCommandHandler,
    AcceptInviteCommandHandler,
    UserMapper,
  ],
  exports: [],
})
export class AuthModule {}
