import { Controller, Param, Post } from '@nestjs/common';

import { InjectLogger, Logger } from '@app/logging';
import {
  TASK_QUEUE_MEDIA_WALL_POST,
  TASK_QUEUE_WALL_POST,
  TASK_QUEUE_YOUTUBE_WALL_POST,
  TASK_QUEUE_GAME_TWITTER_FOLLOWER,
  TemporalClientService,
  WORKFLOW_MEDIA_SOURCING,
  WORKFLOW_WALL_POST_CREATED,
  WORKFLOW_YOUTUBE_SOURCING,
  WORKFLOW_GAME_TWITTER_FOLLOWERS_LIST
} from '@app/temporal';

@Controller('wall-posts')
export class WallPostsController {
  constructor(
    @InjectLogger(WallPostsController.name)
    private readonly logger: Logger,
    private readonly temporalClientService: TemporalClientService,
  ) {}

  @Post(':wallPostId/created')
  async onWallPostCreated(
    @Param('wallPostId') wallPostId: string,
  ): Promise<string> {
    this.logger.info(`Wall post created: ${wallPostId}`);
    const workflowId = `create-wall-post-like-bot-${wallPostId}`;
    await this.temporalClientService.getOrStartWorkflow(
      WORKFLOW_WALL_POST_CREATED,
      {
        workflowId,
        taskQueue: TASK_QUEUE_WALL_POST,
        args: [wallPostId],
      },
    );

    return 'OK';
  }

  @Post('youtube')
  async fetchYoutubeWallPosts(): Promise<string> {
    this.logger.info('Fetching youtube wall posts');
    const workflowId = `fetch-youtube-wall-posts-${Date.now()}`;
    await this.temporalClientService.getOrStartWorkflow(
      WORKFLOW_YOUTUBE_SOURCING,
      {
        workflowId,
        taskQueue: TASK_QUEUE_YOUTUBE_WALL_POST,
        args: [],
      },
    );

    return 'OK';
  }

  @Post('media')
  async fetchMediaWallPosts(): Promise<string> {
    this.logger.info('Fetching media wall posts');
    const workflowId = `fetch-media-wall-posts`;
    await this.temporalClientService.getOrStartWorkflow(
      WORKFLOW_MEDIA_SOURCING,
      {
        workflowId,
        taskQueue: TASK_QUEUE_MEDIA_WALL_POST,
        args: [],
      },
    );
    return 'OK';
  }
}

@Controller('game-twitter-followers')
export class GameTwitterFollowersController {
  constructor(
    @InjectLogger(GameTwitterFollowersController.name)
    private readonly logger: Logger,
    private readonly temporalClientService: TemporalClientService,
  ) {}

  @Post('getFollowerList')
  async onWallPostCreated(): Promise<string> {
    this.logger.info(`retiring the game twitter followers list ${new Date()}`);
    const workflowId = `get-game-twitter-follower-list ${new Date()}`;
    await this.temporalClientService.getOrStartWorkflow(
      WORKFLOW_GAME_TWITTER_FOLLOWERS_LIST,
      {
        workflowId,
        taskQueue: TASK_QUEUE_GAME_TWITTER_FOLLOWER,
        args: [new Date()],
      },
    );

    return 'OK';
  }
}
