import type { MailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';

// Returns Mailer options directly so it can be handed to
// MailerModule.forRootAsync(mailConfig.asProvider()).
export default registerAs(
  'mail',
  (): MailerOptions => ({
    transport: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT ?? '587', 10),
      // true for 465, false for other ports (STARTTLS)
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    defaults: {
      from: process.env.EMAIL_FROM,
    },
  }),
);
