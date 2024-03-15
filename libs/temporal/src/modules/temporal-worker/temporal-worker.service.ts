import { Injectable } from '@nestjs/common';
import {
  bundleWorkflowCode,
  NativeConnection,
  Runtime,
  Worker,
} from '@temporalio/worker';

import { ConfigService } from '@app/config';
import { InjectLogger, Logger } from '@app/logging';
import { TemporalLogger } from '@app/temporal/modules/logging/logger';
import { getLoggerSinks } from '@app/temporal/modules/logging/logger-sinks';

import { LogInterceptor } from '../logging/log.interceptor';

@Injectable()
export class TemporalWorkerService {
  private nativeConnection: NativeConnection;
  private static isRuntimeInstalled = false;
  constructor(
    private readonly configService: ConfigService,
    @InjectLogger(TemporalWorkerService.name)
    private readonly logger: Logger,
  ) {
    if (!TemporalWorkerService.isRuntimeInstalled) {
      TemporalWorkerService.isRuntimeInstalled = true;
      Runtime.install({
        logger: new TemporalLogger(this.logger),
        telemetryOptions: {
          metrics: {
            prometheus: {
              bindAddress: '0.0.0.0:1234',
            },
          },
        },
      });
    }
  }

  async getNativeConnection(): Promise<NativeConnection> {
    if (this.nativeConnection) return this.nativeConnection;

    const host = this.configService.get('temporal.host');
    const port = this.configService.get('temporal.port');
    this.nativeConnection = await NativeConnection.connect({
      address: `${host}:${port}`,
    });
    return this.nativeConnection;
  }

  async createWorker(
    taskQueue: string,
    workflowsPath: string,
    activities?: object,
  ): Promise<Worker> {
    const connection = await this.getNativeConnection();
    const workflowBundle = await bundleWorkflowCode({
      workflowsPath,
      logger: new TemporalLogger(this.logger),
    });

    const maxActivitiesPerSecond =
      +this.configService.get('temporal.maxActivitiesPerSecond', 0) ||
      undefined;

    const maxTaskQueueActivitiesPerSecond =
      +this.configService.get('temporal.maxTaskQueueActivitiesPerSecond', 0) ||
      undefined;

    this.logger.info(
      `maxActivitiesPerSecond: ${maxActivitiesPerSecond}, maxTaskQueueActivitiesPerSecond: ${maxTaskQueueActivitiesPerSecond}`,
    );

    return await Worker.create({
      workflowBundle,
      activities,
      taskQueue,
      connection,
      maxActivitiesPerSecond,
      maxTaskQueueActivitiesPerSecond,
      interceptors: {
        activityInbound: [(ctx) => new LogInterceptor(ctx, this.logger)],
      },
      sinks: getLoggerSinks(this.logger),
    });
  }
}
