import { proxyActivities } from '@temporalio/workflow';

import { WallPostCreatedActivities } from '../activities';

const { logWallPost } = proxyActivities<WallPostCreatedActivities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 3,
  },
});

export async function wallPostCreated(wallPostId: string): Promise<void> {
  await logWallPost(wallPostId);
}
