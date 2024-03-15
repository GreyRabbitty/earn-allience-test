import { WallPost } from '@app/database/entities';
import { logger } from '@app/temporal/modules/logging';

import { WallPostDependencies } from './index';

export type ILogWallPost = (wallPostId: string) => Promise<void>;

export function logWallPost({ db }: WallPostDependencies): ILogWallPost {
  return async (wallPostId) => {
    const post = await db.getRepository(WallPost).findOneBy({ id: wallPostId });

    logger().info(
      `Wall post created:  ${JSON.stringify({ wallPostId, post })}`,
    );
  };
}
