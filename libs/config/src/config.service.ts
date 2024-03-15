import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class ConfigService {
  constructor(private configService: BaseConfigService) {}

  get<T>(path: string, defaultValue: any = null): T {
    return this.configService.get<T>(path) || defaultValue;
  }
}
