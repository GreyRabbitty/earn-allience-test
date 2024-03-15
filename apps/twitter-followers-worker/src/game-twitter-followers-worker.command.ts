import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import {
  TemporalClientService,
  TemporalWorkerService,
  TASK_QUEUE_GAME_TWITTER_FOLLOWER
} from '@app/temporal';

import { fetchFollowersList } from './activities/game-twitter-followers-activities';
import { GameTwitterApiService } from './services/game-twitter-apis.service';
import { GameTwitterFollowersDependencies } from './activities';
@Command({
  name: 'init',
  description: 'init twitter follower worker',
  options: { isDefault: true },
})
export class GameFollowerListCommand extends CommandRunner {
  constructor(
    private readonly temporalWorkerService: TemporalWorkerService,
    private readonly dbConnectionPool: DataSource,
    private readonly configService: ConfigService,
    private readonly gameTwitterFollowersApisService: GameTwitterApiService,
    private readonly temporalClientService: TemporalClientService,
  ) {
    super();
  }

  async run(): Promise<void> {
    const dependencies: GameTwitterFollowersDependencies = {
      db: this.dbConnectionPool,
      configService: this.configService,
      gameTwitterFollowersApisService: this.gameTwitterFollowersApisService,
      temporalClientService: this.temporalClientService,
    };
    const worker = await this.temporalWorkerService.createWorker(
      TASK_QUEUE_GAME_TWITTER_FOLLOWER,
      require.resolve('./workflows'),
      {
        fetchFollowersList: fetchFollowersList(dependencies)
      },
    );
    await worker.run();
  }
}
