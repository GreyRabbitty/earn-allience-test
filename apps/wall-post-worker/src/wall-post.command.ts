import { Command, CommandRunner } from 'nest-commander';
import { DataSource } from 'typeorm';

import { ConfigService } from '@app/config';
import { TASK_QUEUE_WALL_POST, TemporalWorkerService } from '@app/temporal';

import { logWallPost } from './activities/log-wall-post';
import { WallPostDependencies } from './activities';

@Command({
  name: 'init',
  description: 'init discord guild worker',
  options: { isDefault: true },
})
export class WallPostCommand extends CommandRunner {
  constructor(
    private readonly temporalWorkerService: TemporalWorkerService,
    private readonly dbConnectionPool: DataSource,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async run(): Promise<void> {
    const dependencies: WallPostDependencies = {
      db: this.dbConnectionPool,
      configService: this.configService,
    };
    const worker = await this.temporalWorkerService.createWorker(
      TASK_QUEUE_WALL_POST,
      require.resolve('./workflows'),
      {
        logWallPost: logWallPost(dependencies),
      },
    );
    await worker.run();
  }
}
