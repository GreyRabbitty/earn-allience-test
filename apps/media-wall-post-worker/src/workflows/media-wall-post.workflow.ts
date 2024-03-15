import { proxyActivities } from '@temporalio/workflow';

import { RssFeeds } from '@app/database/entities';

import { MediaWallPostActivities } from '../activities';

const activities = proxyActivities<MediaWallPostActivities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 3,
  },
});

export async function mediaWallPostSourcing(): Promise<any> {
  const feeds = await activities.fetchRssFeeds();
  for (const feed of feeds) {
    try {
      await activities.syncAllFeeds(feed);
    } catch (e) {
      console.error(`Workflow for ${feed?.id}`, e);
    }
  }
}

export async function mediaWallPostSourcingById(feed: RssFeeds): Promise<any> {
  const medias = await activities.syncFeedById(feed);
  return medias;
}
