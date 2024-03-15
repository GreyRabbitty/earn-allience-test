import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import {
  TASK_QUEUE_MEDIA_WALL_POST,
  TemporalClientService,
  TemporalWorkerService,
} from '@app/temporal';

import {
  fetchRssFeeds,
  syncAllFeeds,
  syncFeedById,
} from './activities/media-wall-post-activities';
import { MediaApisService } from './services/media-apis.service';
import { MediaWallPostDependencies } from './activities';
@Command({
  name: 'init',
  description: 'init media guild worker',
  options: { isDefault: true },
})
export class MediaWallPostCommand extends CommandRunner {
  constructor(
    private readonly temporalWorkerService: TemporalWorkerService,
    private readonly dbConnectionPool: DataSource,
    private readonly configService: ConfigService,
    private readonly mediaApisService: MediaApisService,
    private readonly temporalClientService: TemporalClientService,
  ) {
    super();
  }

  async run(): Promise<void> {
    const dependencies: MediaWallPostDependencies = {
      db: this.dbConnectionPool,
      configService: this.configService,
      mediaApisService: this.mediaApisService,
      temporalClientService: this.temporalClientService,
    };
    const worker = await this.temporalWorkerService.createWorker(
      TASK_QUEUE_MEDIA_WALL_POST,
      require.resolve('./workflows'),
      {
        fetchRssFeeds: fetchRssFeeds(dependencies),
        syncAllFeeds: syncAllFeeds(dependencies),
        syncFeedById: syncFeedById(dependencies),
      },
    );
    await worker.run();
  }
}
