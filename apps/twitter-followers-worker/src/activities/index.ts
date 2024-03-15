import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import { RssFeeds } from '@app/database/entities';
import { TemporalClientService } from '@app/temporal';
import { BaseActivityDependencies } from '@app/temporal/activities';

import { GameTwitterApiService } from '../services/game-twitter-apis.service';

export interface GameTwitterFollowersDependencies extends BaseActivityDependencies {
  db: DataSource;
  configService: ConfigService;
  gameTwitterFollowersApisService: GameTwitterApiService;
  temporalClientService: TemporalClientService;
}

export interface GameTwitterFollowersListActivities {
  fetchFollowersList: () => Promise<any>;
}
