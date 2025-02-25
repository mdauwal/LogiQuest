import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PasswordResetDto } from './dto/password-reset.dto';

@Controller('auth')
export class PasswordResetController {
  constructor(private emailService: EmailService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() dto: PasswordResetDto) {
    const token = 'generated-reset-token'; // Implement token generation
    await this.emailService.sendVerificationEmail(dto.email, token);
    return { message: 'Password reset email sent' };
  }
}
