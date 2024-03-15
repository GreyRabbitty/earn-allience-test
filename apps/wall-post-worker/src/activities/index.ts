import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import { BaseActivityDependencies } from '@app/temporal/activities';

import { ILogWallPost } from './log-wall-post';

export interface WallPostDependencies extends BaseActivityDependencies {
  db: DataSource;
  configService: ConfigService;
}

export interface WallPostCreatedActivities {
  logWallPost: ILogWallPost;
}
