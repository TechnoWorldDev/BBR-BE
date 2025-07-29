import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { CustomHandlebarsAdapter } from './infrastructure/adapters/custom-handlebars.adapter';
import { SendAcceptedResidenceCommandHandler } from './application/send-accepted-residence.command.handler';
import { SendApplyForRankingCommandHandler } from './application/send-apply-for-ranking.command.handler';
import { SendContactConsultationEmailCommandHandler } from './application/send-contact-consultation.handler';
import { SendContactUsEmailCommandHandler } from './application/send-contact-us.command.handler';
import { SendEmailCommandHandler } from './application/send-email.command.handler';
import { SendInviteEmailCommandHandler } from './application/send-invite-email.command.handler';
import { SendJobApplicationCommandHandler } from './application/send-job-application.command.handler';
import { SendOnFormSubmitCommandHandler } from './application/send-on-form-submit.command.handler';
import { SendOwnershipRequestAcceptedCommandHandler } from './application/send-ownership-request-accepted.command.handler';
import { SendOwnershipRequestDeclinedCommandHandler } from './application/send-ownership-request-declined.command.handler';
import { SendOwnershipRequestCommandHandler } from './application/send-ownership-request.command.handler';
import { SendPaymentConfirmationCommandHandler } from './application/send-payment-confirmation.command.handler';
import { SendPremiumSubscriptionCommandHandler } from './application/send-premium-subscription.command.handler';
import { SendRegisterResidenceCommandHandler } from './application/send-register-residence.command.handler';
import { SendRegisterUnitCommandHandler } from './application/send-register-unit.command.handler';
import { SendRejectedResidenceCommandHandler } from './application/send-rejected-residence.command.handler';
import { SendReportAnErrorCommandHandler } from './application/send-report-an-error.command.handler';
import { SendRequestInformationEmailCommandHandler } from './application/send-request-information.handler';
import { SendResetPasswordEmailCommandHandler } from './application/send-reset-password-email.command.handler';
import { SendSubmitReviewCommandHandler } from './application/send-submit-review.handler';
import { SendSuggestFeatureCommandHandler } from './application/send-suggest-feature.command.handler';
import { SendVerifyEmailCommandHandler } from './application/send-verify-email.command.handler';
import { SendWelcomeEmailCommandHandler } from './application/send-welcome-email.command.handler';
import { IEmailRepository } from './domain/email.repository.interface';
import { EmailRepository } from './infrastructure/email.repository';
import { EmailJobProcessor } from './infrastructure/jobs/email.job';
import { EmailQueue } from './infrastructure/queues/email.queue';
import { EmailHandlerRegistry } from './infrastructure/registry/email-handler.registry';
import { EmailController } from './ui/email.controller';
import { SendB2BFormCommandHandler } from './application/send-b2b-form.command.handler';

@Module({
  controllers: [EmailController],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: config.get('SMTP_SECURE') == 1,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAILER_FROM')}>`,
        },
        template: {
          dir: path.join(
            __dirname,
            '..',
            '..',
            '..',
            'modules',
            'email',
            'infrastructure',
            'templates'
          ),
          adapter: new CustomHandlebarsAdapter(),
        },
        options: {
          strict: true,
        },
      }),
    }),
  ],
  providers: [
    {
      provide: IEmailRepository,
      useClass: EmailRepository,
    },
    SendEmailCommandHandler,
    SendWelcomeEmailCommandHandler,
    SendResetPasswordEmailCommandHandler,
    SendVerifyEmailCommandHandler,
    SendInviteEmailCommandHandler,
    SendOnFormSubmitCommandHandler,
    SendContactConsultationEmailCommandHandler,
    SendRequestInformationEmailCommandHandler,
    SendSubmitReviewCommandHandler,
    SendReportAnErrorCommandHandler,
    SendApplyForRankingCommandHandler,
    SendRegisterResidenceCommandHandler,
    SendJobApplicationCommandHandler,
    SendAcceptedResidenceCommandHandler,
    SendRejectedResidenceCommandHandler,
    SendOwnershipRequestCommandHandler,
    SendOwnershipRequestAcceptedCommandHandler,
    SendOwnershipRequestDeclinedCommandHandler,
    SendSuggestFeatureCommandHandler,
    SendRegisterUnitCommandHandler,
    SendPremiumSubscriptionCommandHandler,
    SendContactUsEmailCommandHandler,
    SendB2BFormCommandHandler,
    SendPaymentConfirmationCommandHandler,
    EmailJobProcessor,
    EmailQueue,
    EmailHandlerRegistry,
  ],
  exports: [EmailQueue, SendPaymentConfirmationCommandHandler],
})
export default class EmailModule {}
