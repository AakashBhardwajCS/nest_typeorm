import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import mailConfig from '../config/mail.config.js';
import { MailController } from './mail.controller.js';
import { MailService } from './mail.service.js';

@Module({
  imports: [
    // Same pattern as DatabaseModule: the 'mail' namespace becomes { useFactory, inject }
    MailerModule.forRootAsync(mailConfig.asProvider()),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
