import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import { RssFeeds } from '@app/database/entities';
import { TemporalClientService } from '@app/temporal';
import { BaseActivityDependencies } from '@app/temporal/activities';

import { MediaApisService } from '../services/media-apis.service';

export interface MediaWallPostDependencies extends BaseActivityDependencies {
  db: DataSource;
  configService: ConfigService;
  mediaApisService: MediaApisService;
  temporalClientService: TemporalClientService;
}

export interface RssFeedMedia {
  title: string;
  url: string;
  postedAt: Date;
  content: string;
}

export interface MediaWallPostActivities {
  fetchRssFeeds: () => Promise<RssFeeds[]>;
  syncAllFeeds: (feed: RssFeeds) => Promise<void>;
  syncFeedById: (feed: RssFeeds) => Promise<boolean>;
}
