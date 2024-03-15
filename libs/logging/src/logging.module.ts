import { DynamicModule, INestApplication, Module } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger, LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { v4 as uuid } from 'uuid';
@Module({})
export class LoggingModule {
  static setup(app: INestApplication) {
    app.useLogger(app.get(Logger));
  }

  static forRoot(options?: { ignore: string[] }): DynamicModule {
    return PinoLoggerModule.forRoot({
      pinoHttp: {
        genReqId: () => uuid(),
        customLogLevel: function (req, res, err) {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          }
          return 'info';
        },
        autoLogging: {
          ignore: (req) => options?.ignore?.includes(req.url),
        },
        customSuccessObject: function (req: Request, res: Response, val) {
          return {
            ...val,
            requestContext: { ...res.locals },
            route: `${req.method} ${req.route?.path || req.path}`,
          };
        },
        customSuccessMessage: function (req, res) {
          return `${res.statusCode} - ${req.method} ${req.url}`;
        },
        customErrorMessage: function (req, res, err) {
          return `${res.statusCode} - ${req.method} ${req.url} - ${err.name}: ${err.message}`;
        },
        customErrorObject: function (req: Request, res: Response, err, val) {
          return {
            ...val,
            requestContext: { ...res.locals },
            route: `${req.method} ${req.route?.path || req.path}`,
          };
        },
        formatters: {
          level: (label) => ({ level: label }),
        },
      },
    });
  }
}
