import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import {
  TASK_QUEUE_YOUTUBE_WALL_POST,
  TemporalClientService,
  TemporalWorkerService,
} from '@app/temporal';

import {
  createOrUpdateWallPost,
  fetchGames,
  fetchVideoStatistics,
  fetchYouTubeChannelVideos,
  runWorkflowForGame,
} from './activities/youtube-sourcing';
import { YoutubeApisService } from './services/youtube-apis.service';
import { YoutubeWallPostDependencies } from './activities';

@Command({
  name: 'init',
  description: 'init youtube guild worker',
  options: { isDefault: true },
})
export class YoutubeWallPostCommand extends CommandRunner {
  constructor(
    private readonly temporalWorkerService: TemporalWorkerService,
    private readonly dbConnectionPool: DataSource,
    private readonly configService: ConfigService,
    private readonly youtubeApisService: YoutubeApisService,
    private readonly temporalClientService: TemporalClientService,
  ) {
    super();
  }

  async run(): Promise<void> {
    const dependencies: YoutubeWallPostDependencies = {
      db: this.dbConnectionPool,
      configService: this.configService,
      youtubeApisService: this.youtubeApisService,
      temporalClientService: this.temporalClientService,
    };
    const worker = await this.temporalWorkerService.createWorker(
      TASK_QUEUE_YOUTUBE_WALL_POST,
      require.resolve('./workflows'),
      {
        fetchGames: fetchGames(dependencies),
        fetchYouTubeChannelVideos: fetchYouTubeChannelVideos(dependencies),
        fetchVideoStatistics: fetchVideoStatistics(dependencies),
        runWorkflowForGame: runWorkflowForGame(dependencies),
        createOrUpdateWallPost: createOrUpdateWallPost(dependencies),
      },
    );
    await worker.run();
  }
}
