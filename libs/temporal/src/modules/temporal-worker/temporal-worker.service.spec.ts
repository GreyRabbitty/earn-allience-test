// imports to be mocked
import { Test, TestingModule } from '@nestjs/testing';
import * as TemporalWorker from '@temporalio/worker';

import { ConfigModule, ConfigService } from '@app/config';
import { LoggingModule } from '@app/logging';

import { TemporalWorkerService } from './temporal-worker.service';

// mock return values
const mockedNativeConnection: TemporalWorker.NativeConnection = {
  _mock: 1,
} as unknown as TemporalWorker.NativeConnection;
const mockedBundleWorkflowCode: TemporalWorker.WorkflowBundleWithSourceMap = {
  _mock: 2,
} as unknown as TemporalWorker.WorkflowBundleWithSourceMap;
const mockedWorker: TemporalWorker.Worker = {
  _mock: 3,
} as unknown as TemporalWorker.Worker;

describe('TemporalWorkerService', () => {
  let service: TemporalWorkerService;

  beforeEach(async () => {
    TemporalWorker.NativeConnection.connect = jest
      .fn()
      .mockResolvedValue(mockedNativeConnection);
    TemporalWorker.Worker.create = jest.fn().mockResolvedValue(mockedWorker);
    jest
      .spyOn(TemporalWorker, 'bundleWorkflowCode')
      .mockResolvedValue(mockedBundleWorkflowCode);

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggingModule.forRoot()],
      providers: [TemporalWorkerService],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          return {
            get: jest
              .fn()
              .mockReturnValueOnce('host')
              .mockReturnValueOnce('port'),
          };
        }
      })
      .compile();
    TemporalWorker.NativeConnection.connect;
    service = module.get<TemporalWorkerService>(TemporalWorkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('getNativeConnection calls NativeConnection.connect once for the first call', async () => {
    const result = await service.getNativeConnection();
    expect(result).toBe(mockedNativeConnection);
    expect(TemporalWorker.NativeConnection.connect).toBeCalled();
  });
  it('getNativeConnection does not call NativeConnection.connect for the second call', async () => {
    const result = await service.getNativeConnection();
    expect(result).toBe(mockedNativeConnection);
    expect(TemporalWorker.NativeConnection.connect).toBeCalled();
    const result2 = await service.getNativeConnection();
    expect(result2).toBe(mockedNativeConnection);
    expect(TemporalWorker.NativeConnection.connect).toBeCalledTimes(1);
  });
  it('creates Worker instance', async () => {
    const taskQueue = 'task-queue';
    const workflowsPath = './workflow-path';
    const activities = { _mock: 3 };
    const result = await service.createWorker(
      taskQueue,
      workflowsPath,
      activities,
    );
    expect(TemporalWorker.NativeConnection.connect).toBeCalledTimes(1);
    expect(TemporalWorker.bundleWorkflowCode).toBeCalledWith(
      expect.objectContaining({ workflowsPath }),
    );
    expect(TemporalWorker.Worker.create).toBeCalledWith(
      expect.objectContaining({
        workflowBundle: mockedBundleWorkflowCode,
        activities,
        taskQueue,
        connection: mockedNativeConnection,
      }),
    );
    expect(result).toBe(mockedWorker);
  });
});
