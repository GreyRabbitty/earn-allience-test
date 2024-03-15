import { Test, TestingModule } from '@nestjs/testing';
import { Connection, WorkflowClient } from '@temporalio/client';

import { ConfigService } from '@app/config';

import { TemporalClientService } from './temporal-client.service';

// create mock returns
const mockedConnection: Connection = { _mock: 1 } as unknown as Connection;
const mockedWorkflowClient: WorkflowClient = {
  _mock: 2,
} as unknown as WorkflowClient;

// mock temporal client Connection and WorkflowClient
jest.mock('@temporalio/client', () => {
  return {
    Connection: jest.fn().mockImplementation(() => ({
      connect: () => mockedConnection,
    })),
    WorkflowClient: jest.fn().mockImplementation(() => mockedWorkflowClient),
  };
});

describe('TemporalClientService', () => {
  let service: TemporalClientService;

  const mockedHost = 'host';
  const mockedPort = 'port';

  beforeEach(async () => {
    Connection.connect = jest.fn().mockResolvedValue(mockedConnection);
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemporalClientService],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          return {
            get: jest
              .fn()
              .mockReturnValueOnce(mockedHost)
              .mockReturnValueOnce(mockedPort),
          };
        }
      })
      .compile();

    service = module.get<TemporalClientService>(TemporalClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('getTemporalClient calls Connection.connect once for the first call', async () => {
    const result = await service.getTemporalClient();
    expect(result).toBe(mockedWorkflowClient);
    expect(Connection.connect).toHaveBeenCalledWith({
      address: `${mockedHost}:${mockedPort}`,
    });
  });
  it('getTemporalClient does not call Connection.connect for the second call', async () => {
    const result = await service.getTemporalClient();
    expect(result).toBe(mockedWorkflowClient);
    expect(Connection.connect).toHaveBeenCalledWith({
      address: `${mockedHost}:${mockedPort}`,
    });
    const result2 = await service.getTemporalClient();
    expect(result2).toBe(mockedWorkflowClient);
    expect(Connection.connect).toBeCalledTimes(1);
  });
});
