import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { google, youtube_v3 } from 'googleapis';

import { ConfigService } from '@app/config';

import { RssFeedVideo } from '../activities';

@Injectable()
export class YoutubeApisService {
  private youtube: youtube_v3.Youtube;

  constructor(private readonly configService: ConfigService) {
    const auth: string = this.configService.get('youtube.apiKey');

    this.youtube = google.youtube({
      version: 'v3',
      auth,
    });
  }

  async getChannelByName(name: string): Promise<string> {
    try {
      const response = await this.youtube.channels.list({
        forHandle: name,
        part: ['id'],
      });

      if (!response.data.pageInfo.totalResults) {
        throw new Error(`Channel not found: ${name}`);
      }

      return response.data.items[0].id;
    } catch (error) {
      throw new Error(`Failed getChannelByName -: ${name}`);
    }
  }

  async getChannelIdByChannelUrl(url: string): Promise<string> {
    try {
      const prefix = 'https://www.youtube.com';
      const splitAndSanitize = (url: string, splitBy: string) => {
        return url.split(splitBy)[1].replace('/featured', '');
      };

      if (url.includes('/channel/')) {
        return splitAndSanitize(url, '/channel/');
      }

      const map = ['/c/', '/user/', `${prefix}/`];
      const urlPrefix = map.find((prefix) => url.includes(prefix));

      const channel = splitAndSanitize(url, urlPrefix);

      return await this.getChannelByName(channel);
    } catch {
      throw new Error(`Failed to get channel id by url -: ${url}`);
    }
  }

  async getVideoStatistics(
    videoIds: string[],
    maxResults = 50,
  ): Promise<youtube_v3.Schema$Video[]> {
    try {
      const toChunks = (array: string[], size: number): string[][] => {
        const results = [];
        while (array.length) {
          results.push(array.splice(0, size));
        }
        return results;
      };

      const chunks = toChunks(videoIds, maxResults);
      const videoStatistics: youtube_v3.Schema$Video[] = [];

      for (const chunk of chunks) {
        await this.youtube.videos
          .list({
            part: ['id', 'statistics'],
            maxResults,
            id: chunk,
          })
          .then((response) => {
            videoStatistics.push(...response.data.items);
          })
          .catch((error) => {
            console.error(
              `Failed to get video statistics for chunk ${chunk.join(',')}`,
              error,
            );
          });
      }
      return videoStatistics;
    } catch (error) {
      throw new Error(
        `Failed to get video statistics for video: ${videoIds.join(',')}`,
      );
    }
  }

  async getVideosByChannelUrl(
    url: string,
    maxResults = 50,
  ): Promise<youtube_v3.Schema$SearchResult[]> {
    const channelId = await this.getChannelIdByChannelUrl(url);
    let videos: youtube_v3.Schema$SearchResult[] = [];
    let pageToken = undefined;
    do {
      const response = await this.youtube.search.list({
        part: ['snippet'],
        channelId,
        maxResults,
        order: 'date',
        type: ['video'],
        pageToken,
      });
      videos = videos.concat(response.data.items);
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    return videos;
  }

  async getRssFeedVideos(channelUrl: string): Promise<RssFeedVideo[]> {
    const channelId = await this.getChannelIdByChannelUrl(channelUrl);

    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await axios.get(url).catch((error) => {
      throw new Error(
        `Failed to fetch rss feed for channel: ${channelId} - ${error.message}`,
      );
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    const json = parser.parse(response.data);

    if (!json.feed.entry) {
      throw new Error(`No videos found for channel: ${channelId}`);
    }

    const entries = Array.isArray(json.feed.entry)
      ? json.feed.entry
      : [json.feed.entry];

    try {
      const videos: RssFeedVideo[] = entries.map((entry: any) => {
        return {
          id: entry['yt:videoId'],
          title: entry.title,
          description: entry['media:group']['media:description'],
          publishedAt: entry.published,
          thumbnail: entry['media:group']['media:thumbnail'].url,
          url: entry.link.href,
          view: entry['media:group']['media:community']['media:statistics']
            .views,
          like: entry['media:group']['media:community']['media:starRating']
            .count,
          starRating:
            entry['media:group']['media:community']['media:starRating'].average,
        };
      });
      return videos;
    } catch (error) {
      throw new Error(
        `Failed to parse rss feed for channel: ${channelId} - ${error.message}`,
      );
    }
  }
}
