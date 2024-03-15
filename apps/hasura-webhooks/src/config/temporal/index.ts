import { registerAs } from '@nestjs/config';

export default registerAs('temporal', () => ({
  host: process.env.TEMPORAL_HOST,
  port: parseInt(process.env.TEMPORAL_PORT),
  maxActivitiesPerSecond: +process.env.TEMPORAL_MAX_ACTIVITIES_PER_SECOND,
  maxTaskQueueActivitiesPerSecond:
    +process.env.TEMPORAL_MAX_TASK_QUEUE_ACTIVITIES_PER_SECOND,
}));
