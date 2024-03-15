import { RssFeeds, WallPost, WallPostRawData } from '@app/database/entities';
import { IWallPostAsset } from '@app/database/interfaces';
import {
  TASK_QUEUE_MEDIA_WALL_POST,
  WORKFLOW_MEDIA_SOURCING_BY_ID,
} from '@app/temporal';
import { logger } from '@app/temporal/modules/logging';

import { MediaWallPostDependencies } from './index';

export function fetchRssFeeds({
  db,
}: MediaWallPostDependencies): () => Promise<RssFeeds[]> {
  return async () => {
    try {
      const feeds = await db.getRepository(RssFeeds).find({
        where: {
          feedType: 'medium',
        },
      });
      logger().info(
        `Fetched feeds ids: ${feeds.map((game) => game.id).join(', ')}`,
      );
      return feeds;
    } catch (error) {
      logger().info(`Fetched feeds error: ${error}`);
    }
  };
}

export function syncAllFeeds({
  temporalClientService,
}: MediaWallPostDependencies): (feed: RssFeeds) => Promise<void> {
  return async (feed: RssFeeds) => {
    const workflowId = `media-sourcing-${feed.id}}`;
    logger().info(`Starting workflow for game: ${feed.id}`);
    await temporalClientService.getOrStartWorkflow(
      WORKFLOW_MEDIA_SOURCING_BY_ID,
      {
        workflowId,
        taskQueue: TASK_QUEUE_MEDIA_WALL_POST,
        args: [feed],
      },
    );
  };
}

export function syncFeedById({
  db,
  mediaApisService,
}: MediaWallPostDependencies): (feed: RssFeeds) => Promise<boolean> {
  return async (feed: RssFeeds) => {
    try {
      const formattedData = await mediaApisService.getRssFeedData(
        feed?.feedUrl,
      );
      //Save the formatted data to the database
      for (const item of formattedData) {
        const media_blog_id = await mediaApisService.extractIdFromLink(
          item.url,
        );
        const media_description = await mediaApisService.extractDescription(
          item.content,
        );
        const existingItem = await db.getRepository(WallPostRawData).findOne({
          where: {
            sourceType: `rss_feeds-${feed?.id}`,
            sourceId: media_blog_id, // or whatever the unique identifier for the item is
          },
        });
        if (!media_blog_id || !item?.title || !item?.url) {
          logger().debug('Not a valid item, skipping');
        } else if (!existingItem) {
          //create and save new item into wall_posts table
          const mediaWallPost = new WallPost();
          const asset: IWallPostAsset = {
            assetType: 'link',
            data: {
              url: item.url,
              title: item.title,
              description: media_description,
            },
          };
          mediaWallPost.title = item.title;
          mediaWallPost.description = media_description;
          mediaWallPost.sourceType = 'medium';
          mediaWallPost.postedAt = item.postedAt;
          mediaWallPost.assets = [asset];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const mediaWalletPostEntity = await db
            .getRepository(WallPost)
            .save(mediaWallPost);
          //create and save new item into wall_post_raw_data table
          const wallPostRawData = new WallPostRawData();
          wallPostRawData.wallPostId = mediaWalletPostEntity?.id;
          wallPostRawData.sourceType = `rss_feeds-${feed?.id}`;
          wallPostRawData.sourceId = media_blog_id;
          wallPostRawData.data = item;
          await db.getRepository(WallPostRawData).save(wallPostRawData);
        }
      }
      logger().debug('Data retrieved successfully', { formattedData });
      return true;
    } catch (error) {
      logger().error('Data retrieved error', { error });
    }
  };
}
