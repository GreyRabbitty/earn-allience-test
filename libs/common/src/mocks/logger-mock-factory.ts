import { PinoLogger } from 'nestjs-pino';

import { MockType } from '@app/common/helpers/test.helper';

export const loggerMockFactory: () => MockType<PinoLogger> = jest.fn(() => ({
  trace: jest.fn(),
  debug: jest.fn((entity) => entity),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  setContext: jest.fn(),
}));
