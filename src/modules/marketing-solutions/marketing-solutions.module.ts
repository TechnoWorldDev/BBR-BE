import { Module } from '@nestjs/common';
import { MarketingSolutionsController } from './ui/marketing-solutions.controller';
import { MarketingSolutionsService } from './application/marketing-solutions.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ResidenceModule } from '../residentmanagement/residence/residence.module';
import { RoleModule } from '../role/roles.module';
import { CompanyModule } from '../company/company.module';
import EmailModule from '../email/email.module';
import { IRoleRepository } from '../role/domain/role.repository.interface';
import { RoleRepositoryImpl } from '../role/infrastructure/role.repository';
import { ICompanyRepository } from '../company/domain/company.repository.interface';
import { CompanyRepository } from '../company/infrastructure/company.repository';
import { RequestPasswordCommandHandler } from '../auth/application/handlers/request-password.command.handler';
import { IAuthRepository } from '../auth/domain/auth.repository.interface';
import { AuthRepository } from '../auth/infrastructure/auth.repository';
import { IPasswordResetRequestRepository } from '../auth/domain/password-reset-request.repository.interface';
import { passwordResetRequestRepository } from '../auth/infrastructure/password-reset-request.repository';
import { SendResetPasswordEmailCommandHandler } from '../email/application/send-reset-password-email.command.handler';
import { IEmailRepository } from '../email/domain/email.repository.interface';
import { EmailRepository } from '../email/infrastructure/email.repository';

@Module({
  imports: [UserModule, AuthModule, ResidenceModule, RoleModule, CompanyModule, EmailModule],
  controllers: [MarketingSolutionsController],
  providers: [
    MarketingSolutionsService,
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    {
      provide: ICompanyRepository,
      useClass: CompanyRepository,
    },
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
    RequestPasswordCommandHandler,
    SendResetPasswordEmailCommandHandler,
  ],
  exports: [MarketingSolutionsService],
})
export class MarketingSolutionsModule {} 