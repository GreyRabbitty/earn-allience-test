import { ConfigModule as BaseConfigModule } from '@nestjs/config/dist/config.module';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BaseConfigModule],
      providers: [ConfigService],
      exports: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
