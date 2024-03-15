import { proxyActivities } from '@temporalio/workflow';

import { RssFeeds } from '@app/database/entities';

import { GameTwitterFollowersListActivities } from '../activities';

const activities = proxyActivities<GameTwitterFollowersListActivities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 3,
  },
});


export async function gameTwitterFollowersList(): Promise<any> {
  const medias = await activities.fetchFollowersList();
  return medias;
}
