import { HttpException, HttpStatus } from '@nestjs/common';

export class GenericHttpException extends HttpException {
  constructor(
    public readonly message: string,
    status = HttpStatus.INTERNAL_SERVER_ERROR,
    private readonly code = 'unexpected',
  ) {
    super(message, status);
  }

  getCode(): string {
    return this.code;
  }
}
