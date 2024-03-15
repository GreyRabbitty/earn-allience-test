import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import { Game } from '@app/database/entities';
import { TemporalClientService } from '@app/temporal';
import { BaseActivityDependencies } from '@app/temporal/activities';

import { YoutubeApisService } from '../services/youtube-apis.service';

export interface YoutubeWallPostDependencies extends BaseActivityDependencies {
  db: DataSource;
  configService: ConfigService;
  youtubeApisService: YoutubeApisService;
  temporalClientService: TemporalClientService;
}

export interface RssFeedVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  view: string;
  like: string;
  starRating: string;
}

export interface YoutubeWallPostActivities {
  fetchGames: () => Promise<Game[]>;
  fetchYouTubeChannelVideos: (game: Game) => Promise<RssFeedVideo[]>;
  runWorkflowForGame: (game: Game) => Promise<void>;
  createOrUpdateWallPost: (game: Game, video: RssFeedVideo) => Promise<boolean>;
}
