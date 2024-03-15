import { proxyActivities } from '@temporalio/workflow';

import { Game } from '@app/database/entities';

import { YoutubeWallPostActivities } from '../activities';

const activities = proxyActivities<YoutubeWallPostActivities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 3,
  },
});

export async function youtubeVideoSourcing(): Promise<void> {
  const games = await activities.fetchGames();
  for (const game of games) {
    try {
      await activities.runWorkflowForGame(game);
    } catch (e) {
      console.error(`Workflow for ${game.id} failed`, e);
    }
  }
}

export async function youtubeVideoSourcingByGame(game: Game): Promise<any> {
  const videos = await activities.fetchYouTubeChannelVideos(game);

  for (const video of videos) {
    await activities.createOrUpdateWallPost(game, video).catch((e) => {
      console.error(
        `Failed to create wall post ${game.id}, video - ${video.id}`,
        e,
      );
    });
  }

  return videos;
}
