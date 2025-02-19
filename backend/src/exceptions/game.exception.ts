import { HttpException } from '@nestjs/common';

export class GameException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(
      {
        status: statusCode,
        error: message,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
