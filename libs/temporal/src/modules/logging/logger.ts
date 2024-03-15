import { Logger } from '@temporalio/worker';

import { Logger as PinoLogger } from '@app/logging';

export class TemporalLogger implements Logger {
  private pinoLogger;

  constructor(pinoLogger: PinoLogger) {
    this.pinoLogger = pinoLogger.logger;
  }

  log(level, message: string, meta?) {
    switch (level) {
      case 'TRACE':
        return this.pinoLogger.child(meta || {}).trace(message);
      case 'DEBUG':
        return this.pinoLogger.child(meta || {}).debug(message);
      case 'WARN':
        return this.pinoLogger.child(meta || {}).warn(message);
      case 'ERROR':
        return this.pinoLogger.child(meta || {}).error(message);
      default:
      case 'INFO':
        return this.pinoLogger.child(meta || {}).info(message);
    }
  }

  debug(message, meta?) {
    this.log('DEBUG', message, meta);
  }

  trace(message, meta?) {
    this.log('TRACE', message, meta);
  }

  info(message, meta?) {
    this.log('INFO', message, meta);
  }

  warn(message, meta?) {
    this.log('WARN', message, meta);
  }

  error(message, meta?) {
    this.log('ERROR', message, meta);
  }
}
