import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

const emailConfig = (configService: ConfigService) => {
  return {
    transport: {
      host: configService.get<string>('NODMAILER_HOST'),
      port: configService.get<number>('NODMAILER_PORT'),
      secure: configService.get<number>('NODMAILER_SECURE') === 1,
      auth: {
        user: configService.get<string>('NODMAILER_USER'),
        pass: configService.get<string>('NODMAILER_PASS'),
      },
    },
    template: {
      dir: path.join(__dirname, '..', '..', '..', '..', 'mailer', 'templates'),
      adapter: new HandlebarsAdapter(),
    },
    options: {
      strict: true,
      partials: {
        dir: path.join(__dirname, '..', '..', '..', '..', 'mailer', 'templates', 'partials'),
        options: {
          strict: true,
        },
      },
    },
  };
};

export const mailerConfig = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => emailConfig(configService),
};
