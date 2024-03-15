import { Not } from 'typeorm';

import { WallPost, WallPostRawData } from '@app/database/entities';
import { Game } from '@app/database/entities/game.entity';
import { IWallPostAsset } from '@app/database/interfaces';
import {
  TASK_QUEUE_YOUTUBE_WALL_POST,
  WORKFLOW_YOUTUBE_VIDEO_SOURCING_BY_GAME,
} from '@app/temporal';
import { logger } from '@app/temporal/modules/logging';

import { RssFeedVideo, YoutubeWallPostDependencies } from './index';

const youtubeMetaKey = 'YOUTUBE_CHANNEL';

export function fetchGames({ db }: YoutubeWallPostDependencies) {
  return async () => {
    const games = await db.getRepository(Game).find({
      where: {
        metadata: {
          metaKey: youtubeMetaKey,
          metaValue: Not(''),
        },
      },
      relations: {
        metadata: true,
      },
    });
    logger().info(
      `Fetched games ids: ${games.map((game) => game.id).join(', ')}`,
    );
    return games;
  };
}

export function fetchYouTubeChannelVideos({
  youtubeApisService,
}: YoutubeWallPostDependencies) {
  return async (game: Game) => {
    const youtubeChannel = game.metadata.find(
      ({ metaKey }) => metaKey === youtubeMetaKey,
    );
    if (!youtubeChannel) {
      throw new Error(`Game: ${game.id} has no youtube channel metadata`);
    }
    logger().info(
      `Game: ${game.id} has youtube channel: ${youtubeChannel.metaValue}`,
    );
    const response = await youtubeApisService.getRssFeedVideos(
      youtubeChannel.metaValue,
    );
    logger().info(
      `Fetched youtube channel: ${youtubeChannel.metaValue}, collected ${response.length} videos`,
    );
    return response;
  };
}

export function fetchVideoStatistics({
  youtubeApisService,
}: YoutubeWallPostDependencies) {
  return async (videoIds: string[]) => {
    const response = await youtubeApisService.getVideoStatistics(videoIds);
    logger().info(
      `Fetched video statistics for video: ${videoIds.join(',')}, collected ${
        response.length
      } videos`,
    );
    return response;
  };
}

export function runWorkflowForGame({
  temporalClientService,
}: YoutubeWallPostDependencies) {
  return async (game: Game) => {
    const workflowId = `youtube-sourcing-${game.id}}`;
    logger().info(`Starting workflow for game: ${game.id}`);
    await temporalClientService.getOrStartWorkflow(
      WORKFLOW_YOUTUBE_VIDEO_SOURCING_BY_GAME,
      {
        workflowId,
        taskQueue: TASK_QUEUE_YOUTUBE_WALL_POST,
        args: [game],
      },
    );
  };
}

export function createOrUpdateWallPost({ db }: YoutubeWallPostDependencies) {
  return async (game: Game, video: RssFeedVideo) => {
    await db
      .transaction(async (manager) => {
        const existingWallPost = await manager
          .getRepository(WallPostRawData)
          .findOne({
            where: {
              sourceId: video.id,
              sourceType: 'youtube',
            },
          });

        const url = `https://www.youtube.com/watch?v=${video.id}`;
        const assets: IWallPostAsset[] = [
          {
            assetType: 'media',
            data: {
              provider: 'youtube',
              url,
              type: 'video',
              previewUrl: video.thumbnail,
            },
          },
          {
            assetType: 'statistics',
            data: {
              views: video.view,
              likes: video.like,
            },
          },
          {
            assetType: 'link',
            data: {
              url,
              title: video.title,
              description: video.description,
            },
          }
        ];

        if (existingWallPost) {
          await manager
            .getRepository(WallPostRawData)
            .update(existingWallPost.id, {
              data: video as any,
            });
          await manager
            .getRepository(WallPost)
            .update(existingWallPost.wallPostId, {
              assets: assets as any
            });
          logger().info(`Updated wall post raw data for game: ${game.id}`);
          return true;
        }

        const wallPost = db.getRepository(WallPost).create({
          title: video.title,
          description: video.description,
          gameId: game.id,
          sourceType: 'youtube',
          postedAt: new Date(video.publishedAt),
          assets: assets as any,
        });

        await db.getRepository(WallPost).save(wallPost);
        logger().info(`Created wall post for game: ${game.id}`);

        const rawWallPost = db.getRepository(WallPostRawData).create({
          wallPostId: wallPost.id,
          data: video,
          sourceType: 'youtube',
          sourceId: video.id,
        });
        await db.getRepository(WallPostRawData).save(rawWallPost);
        logger().info(`Created wall post raw data for game: ${game.id}`);
      })
      .catch((error) => {
        logger().error(
          `Failed to create wall post for game: ${game.id}`,
          error,
        );
        throw error;
      });

    return true;
  };
}
