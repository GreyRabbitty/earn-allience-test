import { ConfigModule as BaseConfigModule } from '@nestjs/config/dist/config.module';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { ConfigService } from '@app/config';

import { YoutubeApisService } from './youtube-apis.service';

jest.mock('axios');

describe('YoutubeApisService', () => {
  let service: YoutubeApisService;
  let mockAxios: jest.Mocked<typeof axios>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BaseConfigModule],
      providers: [YoutubeApisService, ConfigService],
      exports: [ConfigService],
    }).compile();

    service = module.get<YoutubeApisService>(YoutubeApisService);
    mockAxios = jest.mocked(axios, true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and parse RSS feed', async () => {
    const channelId = 'channelId';
    const channelUrl = `https://www.youtube.com/channel/${channelId}`;
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const mockRssResponse = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <link rel="self" href="http://www.youtube.com/feeds/videos.xml?channel_id=UCBY3_rtqMFcuHiFYlejkJ8g"/>
 <id>yt:channel:BY3_rtqMFcuHiFYlejkJ8g</id>
 <yt:channelId>BY3_rtqMFcuHiFYlejkJ8g</yt:channelId>
 <title>Last Remains</title>
 <link rel="alternate" href="https://www.youtube.com/channel/UCBY3_rtqMFcuHiFYlejkJ8g"/>
 <author>
  <name>Last Remains</name>
  <uri>https://www.youtube.com/channel/UCBY3_rtqMFcuHiFYlejkJ8g</uri>
 </author>
 <published>2023-02-28T08:05:25+00:00</published>
 <entry>
  <id>yt:video:2TfPKaFTX8U</id>
  <yt:videoId>2TfPKaFTX8U</yt:videoId>
  <yt:channelId>UCBY3_rtqMFcuHiFYlejkJ8g</yt:channelId>
  <title>Last Remains | Alpha Steam</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=2TfPKaFTX8U"/>
  <author>
   <name>Last Remains</name>
   <uri>https://www.youtube.com/channel/UCBY3_rtqMFcuHiFYlejkJ8g</uri>
  </author>
  <published>2023-12-01T21:54:11+00:00</published>
  <updated>2024-03-03T11:13:32+00:00</updated>
  <media:group>
   <media:title>Last Remains | Alpha Steam</media:title>
   <media:content url="https://www.youtube.com/v/2TfPKaFTX8U?version=3" type="application/x-shockwave-flash" width="640" height="390"/>
   <media:thumbnail url="https://i3.ytimg.com/vi/2TfPKaFTX8U/hqdefault.jpg" width="480" height="360"/>
   <media:description>Learn more on lastremains.gg</media:description>
   <media:community>
    <media:starRating count="3" average="5.00" min="1" max="5"/>
    <media:statistics views="186"/>
   </media:community>
  </media:group>
 </entry>
</feed>
`;

    mockAxios.get.mockResolvedValueOnce({ data: mockRssResponse });

    const videos = await service.getRssFeedVideos(channelUrl);

    expect(videos).toEqual([
      {
        id: '2TfPKaFTX8U',
        title: 'Last Remains | Alpha Steam',
        description: 'Learn more on lastremains.gg',
        publishedAt: '2023-12-01T21:54:11+00:00',
        thumbnail: 'https://i3.ytimg.com/vi/2TfPKaFTX8U/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=2TfPKaFTX8U',
        view: '186',
        like: '3',
        starRating: '5.00',
      },
    ]);

    expect(mockAxios.get).toHaveBeenCalledWith(rssUrl);
  });

  it('should throw error when RSS feed fetch fails', async () => {
    const channelId = 'channelId';
    const channelUrl = `https://www.youtube.com/channel/${channelId}`;

    mockAxios.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(service.getRssFeedVideos(channelUrl)).rejects.toThrow(
      'Failed to fetch rss feed for channel: channelId - Network error',
    );
  });

  it('should throw error when no videos found in RSS feed', async () => {
    const channelId = 'channelId';
    const channelUrl = `https://www.youtube.com/channel/${channelId}`;

    const mockRssResponse =
      '<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" />';

    mockAxios.get.mockResolvedValueOnce({ data: mockRssResponse });

    await expect(service.getRssFeedVideos(channelUrl)).rejects.toThrow(
      'No videos found for channel: channelId',
    );
  });
});
