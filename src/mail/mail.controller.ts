import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ResetPasswordMailDto } from './mail.dto.js';
import { MailService } from './mail.service.js';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('reset-password')
  @HttpCode(200)
  async sendResetPassword(@Body() dto: ResetPasswordMailDto) {
    await this.mailService.sendPasswordReset(dto.email, dto.name);
    return { message: 'Email sent' };
  }
}
