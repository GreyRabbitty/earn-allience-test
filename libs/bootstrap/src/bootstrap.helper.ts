import {
  ExceptionFilter,
  NestInterceptor,
  PipeTransform,
  VersioningOptions,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { CommandFactory } from 'nest-commander';
import { Logger, PinoLogger } from 'nestjs-pino';

import { ConfigService } from '@app/config';

export const bootstrapServer = async (
  module: any,
  params: {
    globalPipes?: PipeTransform[];
    globalFilter?: (
      | ExceptionFilter<any>
      | ((app: NestExpressApplication) => ExceptionFilter<any>)
    )[];
    globalInterceptors?: (
      | NestInterceptor
      | ((app: NestExpressApplication) => NestInterceptor)
    )[];
    versioningOptions?: VersioningOptions;
  } = {},
): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(module, {
    bufferLogs: true,
    cors: true,
  });

  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  app.useLogger(app.get(Logger));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb' }));
  app.set('trust proxy', 1);
  app.use(cookieParser());
  if (params.globalPipes?.length) {
    app.useGlobalPipes(...params.globalPipes);
  }
  if (params.globalFilter?.length) {
    app.useGlobalFilters(
      ...params.globalFilter.map((v) => (typeof v === 'function' ? v(app) : v)),
    );
  }
  if (params.globalInterceptors?.length) {
    app.useGlobalInterceptors(
      ...params.globalInterceptors.map((v) =>
        typeof v === 'function' ? v(app) : v,
      ),
    );
  }
  if (params.versioningOptions) {
    app.enableVersioning(params.versioningOptions);
  }

  const port = config.get<string | number>('app.port', 3001);
  logger.log(`Service ${module.name} start listening on port ${port} ....`);
  await app.listen(port);
};

export const bootstrapWorker = async (module: any): Promise<void> => {
  const logger = new Logger(
    new PinoLogger({
      pinoHttp: {
        formatters: {
          level: (label) => ({ level: label }),
        },
      },
    }),
    {},
  );
  logger.log(`worker start`);
  await CommandFactory.run(module, logger);
  process.exit();
};
