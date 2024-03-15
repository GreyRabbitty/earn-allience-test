import { Module } from '@nestjs/common';
import {
  ConfigModule as BaseConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';

import { ConfigService } from './config.service';

@Module({
  imports: [BaseConfigModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {
  static forRoot(options?: ConfigModuleOptions) {
    return BaseConfigModule.forRoot(options);
  }
}
