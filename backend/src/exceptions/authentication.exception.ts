import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: message,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
