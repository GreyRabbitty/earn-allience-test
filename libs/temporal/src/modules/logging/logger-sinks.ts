import { InjectedSinks } from '@temporalio/worker';
import * as wf from '@temporalio/workflow';

import { Logger as PinoLogger } from '@app/logging';

export interface LoggerSinks extends wf.Sinks {
  defaultWorkerLogger: {
    debug(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
  };
}

export function getLoggerSinks(
  pinoLogger: PinoLogger,
): InjectedSinks<LoggerSinks> {
  const logger = pinoLogger.logger;
  const loggerWithContext = (workflowInfo, meta) =>
    logger.child({
      ...workflowInfo,
      ...meta,
    });
  return {
    defaultWorkerLogger: {
      debug: {
        fn(workflowInfo, message, meta) {
          loggerWithContext(workflowInfo, meta).debug(message);
        },
      },
      info: {
        fn(workflowInfo, message, meta) {
          loggerWithContext(workflowInfo, meta).info(message);
        },
      },
      error: {
        fn(workflowInfo, message, meta) {
          loggerWithContext(workflowInfo, meta).error(message);
        },
      },
      warn: {
        fn(workflowInfo, message, meta) {
          loggerWithContext(workflowInfo, meta).warn(message);
        },
      },
    },
  };
}
