export type TaskQueue = string;
export type Workflow = string;

export const TASK_QUEUE_WALL_POST: TaskQueue = 'wall-post-queue';

export const WORKFLOW_WALL_POST_CREATED: Workflow = 'wallPostCreated';

export const TASK_QUEUE_YOUTUBE_WALL_POST: TaskQueue =
  'youtube-wall-post-queue';

export const WORKFLOW_YOUTUBE_SOURCING: Workflow = 'youtubeVideoSourcing';

export const WORKFLOW_YOUTUBE_VIDEO_SOURCING_BY_GAME: Workflow =
  'youtubeVideoSourcingByGame';

export const TASK_QUEUE_MEDIA_WALL_POST: TaskQueue = 'media-wall-post-queue';

export const WORKFLOW_MEDIA_SOURCING: Workflow = 'mediaWallPostSourcing';

export const WORKFLOW_MEDIA_SOURCING_BY_ID: Workflow =
  'mediaWallPostSourcingById';

export const TASK_QUEUE_GAME_TWITTER_FOLLOWER: TaskQueue = 'game-twitter-follower-queue';

export const WORKFLOW_GAME_TWITTER_FOLLOWERS_LIST: Workflow = 'gameTwitterFollowersList'
