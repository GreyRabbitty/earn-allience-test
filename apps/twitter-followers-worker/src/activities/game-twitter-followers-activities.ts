import { Not } from 'typeorm';

import {
  GameMetadata,
  RssFeeds,
  WallPost,
  WallPostRawData,
  GameFollowersList,
} from '@app/database/entities';
import { IWallPostAsset } from '@app/database/interfaces';
import {
  TASK_QUEUE_MEDIA_WALL_POST,
  WORKFLOW_MEDIA_SOURCING_BY_ID,
} from '@app/temporal';
import { logger } from '@app/temporal/modules/logging';

import { GameTwitterFollowersDependencies } from './index';

const gameMetaKey = 'TWITTER_ID';

// export function fetchRssFeeds({
//   db,
// }: GameTwitterFollowersDependencies): () => Promise<RssFeeds[]> {
//   return async () => {
//     try {
//       const feeds = await db.getRepository(RssFeeds).find({
//         where: {
//           feedType: 'medium',
//         },
//       });
//       logger().info(
//         `Fetched feeds ids: ${feeds.map((game) => game.id).join(', ')}`,
//       );
//       return feeds;
//     } catch (error) {
//       logger().info(`Fetched feeds error: ${error}`);
//     }
//   };
// }

// export function syncAllFeeds({
//   temporalClientService,
// }: GameTwitterFollowersDependencies): (feed: RssFeeds) => Promise<void> {
//   return async (feed: RssFeeds) => {
//     const workflowId = `media-sourcing-${feed.id}}`;
//     logger().info(`Starting workflow for game: ${feed.id}`);
//     await temporalClientService.getOrStartWorkflow(
//       WORKFLOW_MEDIA_SOURCING_BY_ID,
//       {
//         workflowId,
//         taskQueue: TASK_QUEUE_MEDIA_WALL_POST,
//         args: [feed],
//       },
//     );
//   };
// }

// export function syncFeedById({
//   db,
//   gameTwitterFollowersApisService,
// }: GameTwitterFollowersDependencies): (feed: RssFeeds) => Promise<boolean> {
//   return async (feed: RssFeeds) => {
//     try {
//       const formattedData = await gameTwitterFollowersApisService.getRssFeedData(
//         feed?.feedUrl,
//       );
//       //Save the formatted data to the database
//       for (const item of formattedData) {
//         const media_blog_id = await gameTwitterFollowersApisService.extractIdFromLink(
//           item.url,
//         );
//         const media_description = await gameTwitterFollowersApisService.extractDescription(
//           item.content,
//         );
//         const existingItem = await db.getRepository(WallPostRawData).findOne({
//           where: {
//             sourceType: `rss_feeds-${feed?.id}`,
//             sourceId: media_blog_id, // or whatever the unique identifier for the item is
//           },
//         });
//         if (!media_blog_id || !item?.title || !item?.url) {
//           logger().debug('Not a valid item, skipping');
//         } else if (!existingItem) {
//           //create and save new item into wall_posts table
//           const mediaWallPost = new WallPost();
//           const asset: IWallPostAsset = {
//             assetType: 'link',
//             data: {
//               url: item.url,
//               title: item.title,
//               description: media_description,
//             },
//           };
//           mediaWallPost.title = item.title;
//           mediaWallPost.description = media_description;
//           mediaWallPost.sourceType = 'medium';
//           mediaWallPost.postedAt = item.postedAt;
//           mediaWallPost.assets = [asset];
//           // eslint-disable-next-line @typescript-eslint/no-unused-vars
//           const mediaWalletPostEntity = await db
//             .getRepository(WallPost)
//             .save(mediaWallPost);
//           //create and save new item into wall_post_raw_data table
//           const wallPostRawData = new WallPostRawData();
//           wallPostRawData.wallPostId = mediaWalletPostEntity?.id;
//           wallPostRawData.sourceType = `rss_feeds-${feed?.id}`;
//           wallPostRawData.sourceId = media_blog_id;
//           wallPostRawData.data = item;
//           await db.getRepository(WallPostRawData).save(wallPostRawData);
//         }
//       }
//       logger().debug('Data retrieved successfully', { formattedData });
//       return true;
//     } catch (error) {
//       logger().error('Data retrieved error', { error });
//     }
//   };
// }

export function fetchFollowersList({
  db,
  gameTwitterFollowersApisService,
}: GameTwitterFollowersDependencies): () => Promise<any> {
  return async () => {
    try {
      // Fetch the all game twitter account
      const games = await db.getRepository(GameMetadata).find({
        where: {
          metaKey: gameMetaKey,
          metaValue: Not(''),
        },
      });

      const gameIdList = games.map((game) => game.id);

      // chech the available of db
      const flag = await db.getRepository(GameFollowersList).find();

      if (flag.length == 0) {
        const newDB = new GameFollowersList();
        await db.getRepository(GameFollowersList).save(newDB);
      }

      // get Twitter followers by game id
      gameIdList.map(async (gameId) => {
        const list = await gameTwitterFollowersApisService.fetchFollowersListByGameId(gameId);

        // get last followers list
        const existingRaw = await db.getRepository(GameFollowersList).findOne({
          where: {
            gameId: gameId,
          },
        });

        if (existingRaw) {
          const lastFollowerList = existingRaw.recentList;

          // calc new followers
          let newFollowers = await list.filter(
            (x) => !lastFollowerList.includes(x),
          );

          // calc removed followers
          let unfollowers = await lastFollowerList.filter(
            (x) => !list.includes(x),
          );

          // TODO: save the db here
          await db.getRepository(GameFollowersList).update(existingRaw.id, {
            count:list.count,
            recentList: list,
            newList: newFollowers,
            removedList: unfollowers
          });

          logger().info(`Update twitter follower raw data for game: ${gameId}`)
        } else {
          const newRaw = db.getRepository(GameFollowersList).create({
            gameId: gameId,
            count:list.count,
            recentList: list,
            newList: list,
            removedList: []
          })

          await db.getRepository(GameFollowersList).save(newRaw);
          logger().info(`Created wall post raw data for game: ${gameId}`);
        }
        
      });

      return true;
    } catch (error) {
      logger().error('Data retrieved error', { error });
    }
  };
}
