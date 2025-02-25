import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: '"Your App" <your-email@gmail.com>',
      to: email,
      subject: 'Verify your email',
      text: `Click the link to verify: ${verificationLink}`,
    });
  }
}
