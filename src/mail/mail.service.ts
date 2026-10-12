import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppConfigService } from '../config/app-config.service.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly appConfig: AppConfigService,
  ) {}

  async sendPasswordReset(email: string, name = 'there') {
    // placeholder token; a real flow would generate and store one per user
    const token = Math.random().toString(36).slice(2);
    const link = `${this.appConfig.url}/reset-password?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password',
        text: `Hi ${name}, reset your password here: ${link}`,
        html: `<p>Hi ${name},</p>
<p>You requested a password reset. Click the link below to choose a new password:</p>
<p><a href="${link}">Reset password</a></p>
<p>If you didn't request this, you can ignore this email.</p>`,
      });
    } catch (error) {
      this.logger.error(`Failed to send reset email to ${email}`, error);
      throw new InternalServerErrorException('Could not send email');
    }
  }
}
