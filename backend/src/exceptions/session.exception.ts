import { HttpException, HttpStatus } from '@nestjs/common';

export class SessionException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: message,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
