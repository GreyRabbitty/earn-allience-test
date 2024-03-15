import { HttpStatus } from '@nestjs/common';

import { GenericHttpException } from './generic-http-exception';

export class TooManyRequestsException extends GenericHttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, 'too-many-requests');
  }
}
